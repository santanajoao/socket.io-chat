import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SocketIoJwtAdapter } from './auth/adapters/socket.io-jwt.adapter';
import { HttpGlobalExceptionFilter } from './shared/exception-filters/global';
import { FRONTEND_CORS } from './shared/config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ ...FRONTEND_CORS });

  app.use(cookieParser());

  app.useGlobalFilters(new HttpGlobalExceptionFilter());

  app.useWebSocketAdapter(new SocketIoJwtAdapter(app));

  await app.listen(process.env.API_PORT!);
}

bootstrap();
