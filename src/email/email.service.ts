import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { PrismaService } from 'src/database/prisma.service';
import { VERIFY_TEMPLATE } from './templates';

@Injectable()
export class EmailService implements OnModuleInit {
    constructor(private db: PrismaService, private cfg: ConfigService) {}

    private transporter: Transporter
    async onModuleInit() {
        this.transporter = createTransport({
            host: this.cfg.getOrThrow<string>("SMTP_HOST"),
            port: this.cfg.getOrThrow<number>("SMTP_PORT"),
            secure: false, // upgrade later with STARTTLS
            auth: {
              user: this.cfg.getOrThrow<string>("SMTP_USER"),
              pass: this.cfg.getOrThrow<string>("SMTP_PASSWORD"),
            },
        });
    }

    async sendVerificationEmail(emailTo: string, userId: string) {
        const code = await this.db.emailCode.create({
            data: {
                isActivated: false,
                userId: userId,
                code: (Math.floor(Math.random()*1000000)).toString().padStart(6, "0")
            }
        });
        await this.transporter.sendMail({
            from: "Hackathon Spring 2024 <hackathonrgit@yandex.ru>",
            to: emailTo,
            subject: "Верификация аккаунта.",
            html: VERIFY_TEMPLATE.replaceAll("{code}", code.code).replace("{link}", `${this.cfg.getOrThrow<string>("FRONTEND_URL")}/getCode?code=${code.code}`)
        })
    }
}
