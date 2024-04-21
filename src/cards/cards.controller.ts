import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Request as Req } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CardsService } from './cards.service';
import { User } from '@prisma/client';
import { TopupDto } from './dto/Topup.dto';

@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) {}

    @Get('/@me')
    @UseGuards(JwtAuthGuard)
    async getMyCard(@Request() req: Req & {user: User}) {
        return {
            card: await this.cardsService.getOrCreateUserCard(req.user.id)
        }
    }

    @Get('/@me/transactions')
    @UseGuards(JwtAuthGuard)
    async getMyCardTransactions(@Request() req: Req & {user: User}) {
        return {
            transactions: await this.cardsService.getCardTransactions((await this.cardsService.getOrCreateUserCard(req.user.id)).id)
        }
    }

    @Post("/@me/topup")
    @UseGuards(JwtAuthGuard)
    async topupCard(@Body() dto: TopupDto, @Request() req: Req & {user: User}) {
        return {
            card: await this.cardsService.topupBalance((await this.cardsService.getOrCreateUserCard(req.user.id)).id, dto.amount)
        }
    }

}
