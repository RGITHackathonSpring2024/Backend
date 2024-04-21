import { Injectable } from '@nestjs/common';
import { Institution, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class InstitutionsService {
    constructor(private db: PrismaService) {}
    
    async getInstitutionById(id: string): Promise<Institution | null> {
        return await this.db.institution.findUnique({
            where: {
                id
            }
        }) ?? null;
    }
}
