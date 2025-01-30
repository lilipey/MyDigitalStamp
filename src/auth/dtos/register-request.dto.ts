import { UserRole } from 'src/users/users.entity';

export class RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole; // Ajoutez ce champ
}