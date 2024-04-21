import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/SignIn.dto";
import { RegisterDto } from "./dto/Register.dto";
import { EnterCodeDto } from "./dto/EnterCode.dto";
import { UsersService } from "src/users/users.service";
import { LocalAuthGuard } from "./guards/local.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { Request as Req } from "express";
import { User } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("signIn")
  async signIn(@Body() dto: SignInDto, @Request() req) {
    return {
      jwt: await this.authService.loginUser(req.user.id),
      user: req.user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createUser(
      dto.login,
      dto.email,
      dto.password
    );
    const jwt = await this.authService.loginUser(user.id);
    return { user, jwt };
  }

  @HttpCode(HttpStatus.OK)
  @Post("enter-code")
  @UseGuards(JwtAuthGuard)
  async enterCode(@Body() dto: EnterCodeDto, @Request() req: Req & {user: User}) {
    return {
      user: req.user,
      isActivated: await this.authService.tryEnterCode(req.user.id, dto.code)
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get("request-code")
  @UseGuards(JwtAuthGuard)
  async requestCode(@Request() req: Req & {user: User}) {
    return {sent: await this.authService.tryRequestCode(req.user.id)}
  }
}
