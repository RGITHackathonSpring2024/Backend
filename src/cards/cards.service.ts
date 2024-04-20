import { BadRequestException, Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CardsService {
    constructor(private usersService: UsersService, private db: PrismaService) {}

    async getOrCreateUserCard(userId: string): Promise<Card> {
        const user = await this.db.user.findUnique({where: {id: userId}, include: {card: true}});
        // TODO: i18n
        if (user == null) throw new BadRequestException("User not found.");
        if (!user.card) {

        }
        return user.card;
    }
}
