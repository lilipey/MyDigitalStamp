import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  original_file_path: string;

  @Column({ nullable: true })
  stamped_file_path: string;

  @Column()
  mimetype: string;

  // @Column('longblob')
  // data: Buffer;
  
  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}