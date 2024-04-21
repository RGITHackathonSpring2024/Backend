import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { PrismaService } from "./database/prisma.service";
import { CardsService } from "./cards/cards.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: "*" });
  const db = app.get(PrismaService);
  // await db.institution.deleteMany({where: {}})
  // await db.transaction.deleteMany({where: {}})
  // await db.card.deleteMany({where: {}})
  // const user = await db.user.findFirst();
  // const cards = app.get(CardsService);
  // console.log(await cards.getOrCreateUserCard(user.id))

  const isDevelopmentEnvironment = true;

  if (isDevelopmentEnvironment) {
    const { CappadociaViewerInterceptor } = await import(
      "cappadocia-viewer-for-nestjs"
    );

    app.useGlobalInterceptors(new CappadociaViewerInterceptor());
  }
  
  await app.listen(3000);
}
bootstrap();
