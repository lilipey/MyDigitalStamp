import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { Express } from 'express';
import { diskStorage, Multer } from 'multer';
import { FilesService } from './files.service';
import { extname, join } from 'path';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    const path = 'default/path'; // Replace with actual path
    const mimetype = 'application/octet-stream'; // Replace with actual mimetype
    return this.filesService.create(createFileDto, path, mimetype);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.create(file.filename, file.path, file.mimetype);
  }
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return this.filesService.create(file.originalname, file.mimetype, file.buffer);
  // }
  @Get('download/:filename')
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }


}

