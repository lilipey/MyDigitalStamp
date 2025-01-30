// users/users.controller.ts

import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
 //ajouter un endpoint qui va récupérer un seul user en fonction de son id. L’endpoint /users/:id devra récupérer un URL param, et tenter de récupérer un user de la BDD en fonction de son id. Il devra donc renvoyer SOIT un user, SOIT un code 404 si vous y arrivez (petite aide en dessous)

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.usersService.findOnes(id);
  }
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.usersService.remove(id);
  }
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }
}