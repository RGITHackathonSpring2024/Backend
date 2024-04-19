import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcryptjs";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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
}
