import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SocketIoJwtAdapter } from './auth/adapters/socket.io-jwt.adapter';
import { HttpGlobalExceptionFilter } from './shared/exception-filters/global';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpGlobalExceptionFilter());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.use(cookieParser());
  app.useWebSocketAdapter(new SocketIoJwtAdapter(app));

  await app.listen(process.env.API_PORT!);
}

bootstrap();
