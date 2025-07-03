import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const AccessControlAllowOrigins = process.env.ACCESS_CONTROL_ALLOW_ORIGINS?.split(',');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (_, cb) => cb(null, AccessControlAllowOrigins),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
