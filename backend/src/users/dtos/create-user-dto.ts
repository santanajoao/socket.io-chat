export class CreateUserDto {
  email: string;
  password: string;
  username: string;
}

export class CreateUserRepositoryDto {
  email: string;
  passwordHash: string;
  username: string;
}

export class CreatedUserDto {
  id: string;
  email: string;
  username: string;
}
