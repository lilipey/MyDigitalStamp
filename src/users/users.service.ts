import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
   //ajouter un endpoint qui va récupérer un seul user en fonction de son id. L’endpoint /users/:id devra récupérer un URL param, et tenter de récupérer un user de la BDD en fonction de son id. Il devra donc renvoyer SOIT un user, SOIT un code 404 si vous y arrivez (petite aide en dessous)
  async findOnes(id: number): Promise<User> {
    return await this.usersRepository.findOne({where:{id: id}});
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
  async remove(id: number): Promise<void> {
    const user = await this.findOnes(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await this.usersRepository.delete(id);
  }
}