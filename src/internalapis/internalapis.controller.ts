import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ProcessTransactionDto } from "./dtos/ProcessTransaction.dto";
import { PrismaService } from "src/database/prisma.service";
import { UsersService } from "src/users/users.service";
import { CardsService } from "src/cards/cards.service";
import { InternalApiGuard } from "./internalapi.guard";
import { InstitutionsService } from "src/institutions/institutions.service";
import { GetCardDto } from "./dtos/GetCard.dto";
import * as cuid from "@paralleldrive/cuid2";

@Controller("internalapis")
export class InternalapisController {
  constructor(
    private db: PrismaService,
    private usersService: UsersService,
    private cardsService: CardsService,
    private institutionsService: InstitutionsService
  ) {}

  @Post("/process-transaction")
  @UseGuards(InternalApiGuard)
  async processTransaction(@Body() dto: ProcessTransactionDto) {
    const card = await this.cardsService.getCardById(dto.cardId);
    const institution = await this.institutionsService.getInstitutionById(
      dto.institutionId
    );
    // TODO: i18n
    if (!card) throw new BadRequestException("Card is not found");
    if (!institution) throw new BadRequestException("Institution is not found");
    const holder = await this.usersService.getAccountById(card.userId);
    // TODO: i18n
    if (holder.accountState === "DISABLED")
      throw new BadRequestException("User account was banned.");

    if (card.balance >= dto.amount) {
      const transaction = await this.db.transaction.create({
        data: {
          cardId: card.id,
          institutionId: institution.id,
          amount: dto.amount,
        },
      });
      await this.db.card.update({
        where: { id: card.id },
        data: { balance: { decrement: dto.amount } },
      });
      return {
        transactionId: transaction.id,
      };
    } else {
      throw new BadRequestException("Not enough money for this payment.");
    }
  }

  @Post("/update-card")
  @UseGuards(InternalApiGuard)
  async updateCard(@Body() dto: GetCardDto) {
    const card = await this.db.card.findFirst({
      where: { lastToken: dto.cardToken },
      select: { id: true },
    });

    const cardId = card.id;
    const newToken = cuid.createId();

    await this.db.card.update({
      where: { id: card.id },
      data: { lastToken: newToken },
    });

    return {
      cardId,
      newToken,
    };
  }

  @Get("/cards/:id")
  @UseGuards(InternalApiGuard)
  async getCard(@Param("id") parameterId: string) {
    const card = await this.db.card.findFirst({
      where: { id: parameterId },
      include: { transaction: true, user: true },
    });

    return { card };
  }

  @Get("/users/:id")
  @UseGuards(InternalApiGuard)
  async getUser(@Param("id") parameterId: string) {
    const user = await this.db.user.findFirst({
      where: { id: parameterId },
      include: { card: true },
    });
    
    return { user };
  }
}
