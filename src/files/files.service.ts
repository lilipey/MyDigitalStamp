import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  fileRepository: any;
  getFile(filename: string) {
    throw new Error('Method not implemented.');
  }
  create(createFileDto: CreateFileDto, path: string, mimetype: string) {
    //save file 
    
    return 'This action adds a new file';
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
}
