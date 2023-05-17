import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.use(json({ limit: '20mb' }));

  await app.listen(3002);
}
bootstrap();
