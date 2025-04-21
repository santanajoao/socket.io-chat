import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const data = await this.authService.register(body);
    return data;
  }
}
