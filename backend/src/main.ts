import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SocketIoJwtAdapter } from './auth/adapters/socket.io-jwt.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useWebSocketAdapter(new SocketIoJwtAdapter(app));

  await app.listen(process.env.API_PORT!);
}

bootstrap();
