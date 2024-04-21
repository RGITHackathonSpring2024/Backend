import { Module } from "@nestjs/common";
import { PrismaModule } from "./database/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { CardsModule } from "./cards/cards.module";
import { InternalapisModule } from "./internalapis/internalapis.module";
import { InstitutionsModule } from "./institutions/institutions.module";
import { EmailModule } from "./email/email.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    CardsModule,
    InternalapisModule,
    InstitutionsModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
