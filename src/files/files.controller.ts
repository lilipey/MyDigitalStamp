// files.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Delete, UseGuards, NotFoundException, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../users/users.entity';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../users/users.entity';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Controller('files')
@UseGuards(RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
    @Body('description') description: string
  ): Promise<any> {
    return await this.filesService.create(file, description, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.filesService.findOne(+id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.filesService.remove(+id);
    return { message: 'File deleted successfully' };
  }

  @Get('download/:filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const filePath = join(process.cwd(), 'uploads', 'stamped', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filename}`);
    }
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @Get('verify/:filename')
  async verifyFile(@Param('filename') filename: string): Promise<string | null> {
    const filePath = join(process.cwd(), 'uploads', 'stamped', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filename}`);
    }
    return await this.filesService.verifyImage(filePath);
  }
}
