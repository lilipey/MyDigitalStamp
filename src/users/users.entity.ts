import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Certificate } from 'src/certificates/entities/certificate.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // @OneToMany(() => Certificate, certificate => certificate.user)
  // certificates: Certificate[];
}