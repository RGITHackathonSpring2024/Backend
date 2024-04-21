import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { isEmail } from 'class-validator';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import { validateEmail } from 'src/utils/validateEmail';

@Injectable()
export class UsersService {
    constructor(private db: PrismaService, private emailService: EmailService) {}

    async createUser(
        login: string,
        email: string,
        password: string | null
    ): Promise<User> {
        const candidate = await this.db.user.findFirst({
            where: {
                OR: [
                    {
                        login
                    },
                    {
                        email
                    }
                ]
            }
        });

        if (candidate) {
            // TODO: i18n
            throw new BadRequestException("Пользователь с таким логином или с такой почтой уже существует.");
        }

        const user = await this.db.user.create({
            data: {
                login,
                email,
                password: password ? await hash(password, await genSalt()) : null,
                accountState: 'EMAIL_VERIFICATION'
            }
        });
        await this.emailService.sendVerificationEmail(email, user.id);
        return user;
    }

    async getAccountById(id: string): Promise<User | null> {
        return await this.db.user.findUnique({
            where: {
                id
            }
        }) ?? null;
    }

    async getAccountByLogin(login: string): Promise<User | null> {
        return await this.db.user.findUnique({
            where: {
                login
            }
        }) ?? null;
    }

    async getAccountByEmail(email: string): Promise<User | null> {
        return await this.db.user.findUnique({
            where: {
                email
            }
        }) ?? null;
    }

    /*
    * @explanation - credential в коде значит login или email
    */
    async getAccountByCredential(credential: string): Promise<User | null> {
        
        if (isEmail(credential)) {
            return await this.getAccountByEmail(credential)
        }
        return await this.getAccountByLogin(credential)
    }
}
