import { Injectable, NotFoundException } from '@nestjs/common';
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
    const stampedFilePath = join('uploads/stamped', `stamped-${file.filename}`);

    // Créer les répertoires s'ils n'existent pas
    if (!existsSync('uploads/originals')) {
      mkdirSync('uploads/originals', { recursive: true });
    }
    if (!existsSync('uploads/stamped')) {
      mkdirSync('uploads/stamped', { recursive: true });
    }

    // Déplacer le fichier original vers le dossier des originaux
    renameSync(file.path, originalFilePath);

    // Vérifier si c'est une image PNG ou JPEG
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      await this.stampImage(originalFilePath, stampedFilePath, userId);
    } else {
      // Copier simplement le fichier si ce n'est pas une image PNG ou JPEG
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

  private async stampImage(originalPath: string, stampedPath: string, userId: string): Promise<void> {
    const image = PNG.sync.read(readFileSync(originalPath));
    const message = userId + '||END';
    const messageBytes = Buffer.from(message, 'utf-8');
  
    for (let i = 0; i < messageBytes.length; i++) {
      const byte = messageBytes[i];
      for (let bit = 0; bit < 8; bit++) {
        const index = (i * 8 + bit) * 4;
        if (index >= image.data.length) break;
        image.data[index] = (image.data[index] & 0xFE) | ((byte >> bit) & 1);
      }
    }
  
    writeFileSync(stampedPath, PNG.sync.write(image));
  }
  async verifyImage(filePath: string): Promise<string | null> {
    const image = PNG.sync.read(readFileSync(filePath));
    
    let decodedMessage = '';
    let currentChar = 0;
    let bitCount = 0;
  
    for (let i = 0; i < image.data.length; i += 4) {
      currentChar |= (image.data[i] & 0x01) << bitCount;
      bitCount++;
  
      if (bitCount === 8) {
        decodedMessage += String.fromCharCode(currentChar);
        currentChar = 0;
        bitCount = 0;
  
        if (decodedMessage.endsWith('==')) {
          break;
        }
      }
    }
  
    try {
      // Enlever le marqueur de fin et décoder
      const encodedMessage = decodedMessage.slice(0, -2);
      return Buffer.from(encodedMessage, 'base64').toString('utf-8');
    } catch (e) {
      console.error('Error decoding message:', e);
      return null;
    }
  }

  async verifyImageFromBuffer(buffer: Buffer): Promise<string | null> {
    try {
      const image = PNG.sync.read(buffer);
      let message = '';
      let byte = 0;
  
      for (let i = 0; i < image.data.length; i += 32) {
        byte = 0;
        for (let bit = 0; bit < 8; bit++) {
          if (i + bit * 4 >= image.data.length) break;
          byte |= (image.data[i + bit * 4] & 1) << bit;
        }
        message += String.fromCharCode(byte);
        if (message.endsWith('||END')) {
          break;
        }
      }
  
      const userId = message.split('||')[0];
      console.log('Decoded userId:', userId);
      return userId;
    } catch (e) {
      console.error('Erreur lors du décodage du message:', e);
      return null;
    }
  }
  
  

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: string): Promise<File> {
    return this.fileRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }
}