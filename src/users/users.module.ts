import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [PrismaService, UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
