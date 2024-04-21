import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/database/prisma.service";
import { PrismaModule } from "src/database/prisma.module";
import { UsersService } from "src/users/users.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EmailModule } from "src/email/email.module";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    PrismaModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: async (cfg: ConfigService) => ({
        global: true,
        secret: await cfg.getOrThrow<string>("JWT_SECRET"),
        signOptions: { expiresIn: "30d" },
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
  ],
  providers: [PrismaService, UsersService, AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
