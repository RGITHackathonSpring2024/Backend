import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {}
