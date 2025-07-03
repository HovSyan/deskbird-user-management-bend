import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const AccessControlAllowOrigins = process.env.ACCESS_CONTROL_ALLOW_ORIGINS?.split(',');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (_, cb) => cb(null, AccessControlAllowOrigins),
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
