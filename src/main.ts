import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({origin: "*"});
  const db = app.get(PrismaService);
  console.log(await db.user.findFirst({include: {card: true}}))
  await app.listen(3000);
}
bootstrap();
