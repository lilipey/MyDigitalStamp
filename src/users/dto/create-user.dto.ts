// users/dto/create-user.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()  
  @IsNotEmpty()
  email: string;
}