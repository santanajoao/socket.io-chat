export interface HashService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, passwordHash: string): Promise<boolean>;
}
