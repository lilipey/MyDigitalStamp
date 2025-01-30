import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/users/users.entity';
import { AccessToken } from './types/AccessToken';
import { UsersService } from 'src/users/users.service';
import { RegisterRequestDto } from './dtos/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerRequestDto: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(registerRequestDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerRequestDto.password, 10);
    const newUser: User = {
      ...registerRequestDto,
      password: hashedPassword,
      id: undefined, // Laissez TypeORM générer l'ID automatiquement
    };
    console.log(newUser);
    await this.usersService.create(newUser);
    return this.login(newUser);
  }


  async isAdmin(user: User): Promise<boolean> {
    return user.role === UserRole.ADMIN;
  }
}
