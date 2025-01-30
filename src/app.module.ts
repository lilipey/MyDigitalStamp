// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // changer les infos pour correspondre à votre BDD
      password: 'root', // changer les infos pour correspondre à votre BDD
      database: 'mydigitalstamp', // changer les infos pour correspondre à votre BDD
      entities: [User], // ajoutez les entités prises en charge par l'ORM
      synchronize: true,
    }),
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}