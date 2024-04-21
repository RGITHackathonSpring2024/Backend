import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InstitutionsService],
  exports: [InstitutionsService]
})
export class InstitutionsModule {}
