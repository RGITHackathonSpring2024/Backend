import { BadRequestException, Injectable } from "@nestjs/common";
import { Card, Transaction } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { UsersService } from "src/users/users.service";
import randomBigInt from "src/utils/bigIntRNG";
@Injectable()
export class CardsService {
  constructor(private usersService: UsersService, private db: PrismaService) {}

  async getOrCreateUserCard(userId: string): Promise<Omit<Card, 'lastToken'>> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: { card: true },
    });
    // TODO: i18n
    if (user == null) throw new BadRequestException("User not found.");
    if (user.card === null) {
      const card = await this.db.card.create({
        data: {
          expiration: new Date(Date.now() + 91584000000),
          permanentAccountNumber: randomBigInt(9999_9999_9999_9999n).toString().padStart(12, "0"),
          balance: 0,
          userId: userId,
        },
        select: {
            lastToken: false, balance: true, expiration: true, id: true, permanentAccountNumber: true, transaction: true,  user: true, userId: true
        }
      });
      return card;
    }
    return user.card;
  }

  async getCardById(id: string): Promise<Omit<Card, "lastToken"> | null> {
    return (
      (await this.db.card.findUnique({
        where: {
          id,
        },
        select: {
          lastToken: false,
          balance: true,
          expiration: true,
          id: true,
          permanentAccountNumber: true,
          transaction: true,
          user: true,
          userId: true,
        },
      })) ?? null
    );
  }

  async getCardTransactions(cardId: string): Promise<Transaction[]> {
    return await this.db.transaction.findMany({
      where: {cardId: cardId},
      include: {card: {select: {
        lastToken: false,
        balance: true,
        expiration: true,
        id: true,
        permanentAccountNumber: true,
        transaction: false,
        user: false,
        userId: true,
      }}, toInstitution: true}
    })
  }

  async topupBalance(cardId: string, amount: number): Promise<Omit<Card, 'lastToken'>> {
    const card = await this.getCardById(cardId);
    if (card === null) throw new BadRequestException("card is not exist");
    
    await this.db.card.update({
      where: {id: card.id},
      data: {balance: {increment: amount}}
    });

    return (await this.getCardById(cardId))!!;
  }
}
