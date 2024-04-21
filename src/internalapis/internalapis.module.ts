import { Module } from '@nestjs/common';
import { InternalapisController } from './internalapis.controller';
import { UsersService } from 'src/users/users.service';
import { CardsService } from 'src/cards/cards.service';
import { UsersModule } from 'src/users/users.module';
import { CardsModule } from 'src/cards/cards.module';
import { PrismaModule } from 'src/database/prisma.module';
import { InstitutionsModule } from 'src/institutions/institutions.module';

@Module({
  imports: [PrismaModule, InstitutionsModule, UsersModule, CardsModule],
  controllers: [InternalapisController]
})
export class InternalapisModule {}
