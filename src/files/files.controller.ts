import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { StreamableFile } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/users/users.entity';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/users.entity';

@Controller('files')
@UseGuards(RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
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
  async uploadFile(@UploadedFile() file: Express.Multer.File, @GetUser() user: User, @Body('description') description?: string): Promise<any> {
    console.log(file);
    return await this.filesService.create(file, description, user.id);
  }

  @Get('download/:filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filename}`);
    }
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @Get('verify/:filename')
  async verifyFile(@Param('filename') filename: string): Promise<string | null> {
    const filePath = join(process.cwd(), 'uploads/stamped', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filename}`);
    }
    return await this.filesService.verifyImage(filePath);
  }
}