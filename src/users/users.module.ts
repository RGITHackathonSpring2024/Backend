import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [PrismaModule,EmailModule],
  providers: [PrismaService, EmailService, UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
