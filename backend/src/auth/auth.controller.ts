import { Body, Controller, Post, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register-dto';
import { LoginDto } from './dtos/login-dto';
import { Response as ExpressResponse } from 'express';
import { COOKIE_DEFAULT_CONFIG, JWT_COOKIE_KEY } from './constants/cookies';
import { TOKEN_MAX_AGE_MS } from './constants/jwt';
import { PublicRoute } from './decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register(body);

    return {
      data: result.data,
    };
  }

  @PublicRoute()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(body);

    res.cookie(JWT_COOKIE_KEY, result.metadata.jwtToken, {
      ...COOKIE_DEFAULT_CONFIG,
      maxAge: TOKEN_MAX_AGE_MS,
    });

    return {
      data: result.data,
    };
  }
}
