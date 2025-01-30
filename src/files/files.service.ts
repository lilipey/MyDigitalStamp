import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { User } from 'src/users/users.entity';
import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PNG } from 'pngjs';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(file: Express.Multer.File, description?: string, userId?: string): Promise<File> {
    const originalFilePath = join('uploads/originals', file.filename);
    const stampedFilePath = join('uploads/stamped', file.filename);

    // Créer les répertoires s'ils n'existent pas
    if (!existsSync('uploads/originals')) {
      mkdirSync('uploads/originals', { recursive: true });
    }
    if (!existsSync('uploads/stamped')) {
      mkdirSync('uploads/stamped', { recursive: true });
    }

    // Déplacer le fichier original vers le dossier des originaux
    renameSync(file.path, originalFilePath);

    // Vérifier si c'est une image PNG
    if (file.mimetype === 'image/png') {
      await this.stampImage(stampedFilePath, userId);
    } else {
      // Copier simplement le fichier si ce n'est pas une image PNG
      writeFileSync(stampedFilePath, readFileSync(originalFilePath));
    }

    // Charger l'utilisateur à partir de l'ID
    const user = userId ? await this.userRepository.findOneBy({ id: userId }) : null;

    const newFile = this.fileRepository.create({
      filename: file.filename,
      mimetype: file.mimetype,
      originalFilePath,
      stampedFilePath,
      description: description || 'Uploaded file',
      user: user,
    });

    return await this.fileRepository.save(newFile);
  }

  private async stampImage(originalPath: string, stampedPath: string, userId?: string): Promise<void> {
    const image = PNG.sync.read(readFileSync(originalPath));
    
    // Convertir l'UID en chaîne et encoder
    const userIdString = userId || 'Unknown';
    const encodedMessage = Buffer.from(userIdString).toString('base64');

    // Modifier légèrement les pixels pour "cacher" l'information
    for (let i = 0; i < encodedMessage.length; i++) {
      const charCode = encodedMessage.charCodeAt(i);
      image.data[i * 4] = (image.data[i * 4] & 0xFE) | (charCode & 0x01); // Modifier le canal rouge
      image.data[i * 4 + 1] = (image.data[i * 4 + 1] & 0xFE) | ((charCode >> 1) & 0x01); // Modifier le canal vert
      image.data[i * 4 + 2] = (image.data[i * 4 + 2] & 0xFE) | ((charCode >> 2) & 0x01); // Modifier le canal bleu
    }

    // Sauvegarder l'image estampillée
    writeFileSync(stampedPath, PNG.sync.write(image));
  }

  async verifyImage(filePath: string): Promise<string | null> {
    const image = PNG.sync.read(readFileSync(filePath));
    
    let decodedMessage = '';
    for (let i = 0; i < image.data.length; i += 4) {
      const charCode = (image.data[i] & 0x01) | ((image.data[i + 1] & 0x01) << 1) | ((image.data[i + 2] & 0x01) << 2);
      decodedMessage += String.fromCharCode(charCode);
      if (decodedMessage.endsWith('==')) break; // Fin du message encodé
    }

    try {
      return Buffer.from(decodedMessage, 'base64').toString('utf-8');
    } catch (e) {
      return null;
    }
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  async remove(id: number): Promise<void> {
    await this.fileRepository.delete(id);
  }
}