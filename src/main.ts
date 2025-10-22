import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

const { COOKIE_SECRET, PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(COOKIE_SECRET));
  await app.listen(PORT ?? 3000);
}
void bootstrap();
