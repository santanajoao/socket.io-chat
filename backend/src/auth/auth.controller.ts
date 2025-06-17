import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register-dto';
import { LoginDto } from './dtos/login-dto';
import { Response as ExpressResponse } from 'express';
import { COOKIE_DEFAULT_CONFIG, JWT_COOKIE_KEY } from './constants/cookies';
import { TOKEN_MAX_AGE_MS } from './constants/jwt';
import { PublicRoute } from './decorators/public-route.decorator';
import { AuthenticatedExpressRequest } from './interfaces/jwt.interfaces';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { RegisterSchema } from './schemas/register.schema';
import { LoginSchema } from './schemas/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('register')
  @UsePipes(new ValidationPipe(RegisterSchema))
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register(body);

    return {
      data: result.data,
    };
  }

  @PublicRoute()
  @Post('login')
  @UsePipes(new ValidationPipe(LoginSchema))
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

  @Get('user')
  async getLoggedUser(@Request() req: AuthenticatedExpressRequest) {
    const response = await this.authService.getLoggedUser({
      userId: req.user.id,
    });

    return {
      data: response.data,
    };
  }
}
