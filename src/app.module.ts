import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, CardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
