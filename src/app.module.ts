import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/users.entity'; // Ensure this path is correct
import { File } from './files/entities/file.entity'; // Import the File entity
import { FilesModule } from './files/files.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard'; // Ensure this path is correct
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
// import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Update with your database username
      password: 'root', // Update with your database password
      database: 'mydigitalstamp', // Update with your database name
      entities: [User, File], // Add all entities here
      synchronize: true, // Automatically sync database schema (use only in development)
    }),
    FilesModule, 
    UsersModule,
    AuthModule,
    // CertificatesModule,// Import your FilesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
