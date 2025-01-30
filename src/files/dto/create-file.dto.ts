export class CreateFileDto {
  filename: string;
  mimetype: string;
  data: Buffer;
  description?: string;
  path: string;
  createdAt: Date;
}