import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcryptjs";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { EmailService } from "src/email/email.service";
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private db: PrismaService,
    private emailService: EmailService
  ) {}

  async validateUser(credential: string, password: string): Promise<User | null> {
    const user = await this.usersService.getAccountByCredential(credential);
    if (user == null) return null;

    if (!(await compare(password, user.password))) {
      return null;
    }
    return user
  }

  async loginUser(userId: string): Promise<string> {
    const user = await this.usersService.getAccountById(userId);
    if (user == null) throw new UnauthorizedException();
    const payload = { sub: user.id };
    return await this.jwtService.signAsync(payload);
  }

  async tryEnterCode(userId: string, code: string) {
    const uc = await this.usersService.getAccountById(userId);
    if (uc === null || uc.accountState !== "EMAIL_VERIFICATION") {
      console.log("skipping 1", uc.accountState)
      return false;
    }

    const candidate = await this.db.emailCode.findFirst({ where: {userId: uc.id, isActivated: false, code: code} });
    if (candidate === null) {
      console.log("skipping 2", uc.id, code)

      return false;
    }

    await this.db.emailCode.updateMany({where: {userId: uc.id, isActivated: false}, data: {isActivated: true}});
    await this.db.user.update({where: {id: uc.id}, data: {accountState: "VERIFIED"}})
  
    return true;
  }

  async tryRequestCode(userId: string) {
    const uc = await this.usersService.getAccountById(userId);
    if (uc === null || uc.accountState !== "EMAIL_VERIFICATION") {
      console.log("skipping 1", uc.accountState)
      return false;
    }

    const candidate = await this.db.emailCode.findFirst({ where: {userId: uc.id, isActivated: false} });
    if (candidate === null) {
      await this.emailService.sendVerificationEmail(uc.email, uc.id)
      return true;
    }
    return false;
  }
}
