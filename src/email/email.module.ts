import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { PrismaModule } from 'src/database/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
