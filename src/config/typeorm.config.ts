import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();


const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'mydigitalstamp',
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
}); 

export default AppDataSource;