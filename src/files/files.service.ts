import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { readFileSync } from 'fs';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async create(file: Express.Multer.File, description?: string): Promise<File> {
    const newFile = this.fileRepository.create({
      filename: file.filename,
      mimetype: file.mimetype,
      path: file.path,
      description: description || 'Uploaded file',
      data: readFileSync(file.path),
    });
    return await this.fileRepository.save(newFile);
  }
  // async create(filename: string, mimetype: string, buffer: Buffer) {
  //   const file = this.fileRepository.create({ filename, mimetype, data: buffer });
  //   return this.fileRepository.save(file);
  // }
  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  // private stegcloak = new StegCloak(true, false);

  // hideMessage(coverText: string, secretMessage: string, password: string): string {
  //   return this.stegcloak.hide(secretMessage, password, coverText);
  // }

  // revealMessage(stegoText: string, password: string): string {
  //   return this.stegcloak.reveal(stegoText, password);
  // }
}
