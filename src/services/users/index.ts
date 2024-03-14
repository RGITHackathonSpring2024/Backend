import { Session, User } from "@prisma/client";
import { Context, Service } from "moleculer";
import {
  MoleculerAction,
  MoleculerService,
  MoleculerServiceStarted,
} from "moleculer-plus";
import { FindUserByLoginDto } from "./dtos/FindUserByLogin.dto";
import { prisma } from "../../utils/database";
import { RegisterUserDto } from "./dtos/RegisterUser.dto";
import { compare, genSalt, hash } from "bcryptjs";
import { LoginUserDto } from "./dtos/LoginUser.dto";
import { sign } from "jsonwebtoken";
import { SECRET } from "../../utils/secret";
import { LoginSessionUserDto } from "./dtos/LoginSessionUser.dto";
import { CheckSessionByTokenDto } from "./dtos/CheckSessionByToken.dto";

@MoleculerService({
  name: "users",
})
export default class UsersService extends Service {
  @MoleculerServiceStarted()
  public Start() {}

  @MoleculerAction({ name: "find-user-by-login", params: FindUserByLoginDto })
  public async FindUserByLogin(
    ctx: Context<FindUserByLoginDto>
  ): Promise<User | null> {
    const { Login } = ctx.params;

    const candidate = await prisma.user.findFirst({ where: { Login } });

    return candidate;
  }

  @MoleculerAction({ name: "register-user", params: RegisterUserDto })
  public async RegisterUser(
    ctx: Context<RegisterUserDto>
  ): Promise<User | null> {
    const { Login, Password } = ctx.params;

    const candidate = await prisma.user.findFirst({ where: { Login } });

    if (candidate != null) {
      throw new Error("EU0001: User with this login already exists");
      return null;
    }

    const hashedPassword = await hash(Password, await genSalt());

    const user = await prisma.user.create({
      data: {
        Login,
        Password: hashedPassword,
      },
    });

    return user;
  }

  @MoleculerAction({ name: "login-user", params: LoginUserDto })
  public async LoginUser(ctx: Context<LoginUserDto>): Promise<Session | null> {
    const { Login, Password, Scopes } = ctx.params;

    const candidate = await prisma.user.findFirst({ where: { Login } });

    if (candidate == null) {
      throw new Error("EU0003: User not exists");
      return null;
    }

    if (await compare(Password, candidate.Password)) {
      const payload = {
        sub: candidate.Identifier,
      };

      const token = await sign(payload, SECRET);

      const session = await prisma.session.create({
        data: {
          Token: token,
          User: {
            connect: candidate,
          },
          Scopes
        },
      });

      return session;
    } else {
      throw new Error("EU0002: Password not exists");
      return null;
    }
  }

  @MoleculerAction({ name: "login-user-session", params: LoginSessionUserDto })
  public async LoginSessionUser(
    ctx: Context<LoginSessionUserDto>
  ): Promise<Session | null> {
    const { UserIdentifier, Scopes } = ctx.params;
    console.log(ctx.params)

    const user = await prisma.user.findFirst({
      where: { Identifier: UserIdentifier },
    });

    if (user == null) {
      throw new Error("EU0003: User not exists");
      return null;
    }

    const payload = {
      sub: user.Identifier,
    };

    const token = await sign(payload, SECRET);

    const session = await prisma.session.create({
      data: {
        Token: token,
        User: {
          connect: user,
        },
        Scopes
      },
    });

    return session;
  }

  @MoleculerAction({ name: "check-session", params: CheckSessionByTokenDto })
  public async CheckSession(
    ctx: Context<CheckSessionByTokenDto>
  ): Promise<{ User: User; Session: Session } | null> {
    const { Token } = ctx.params;

    const session = await prisma.session.findFirst({ where: { Token } });
    if (!session) return null;
    const user = await prisma.user.findFirst({
      where: { Identifier: session.UserID },
    });
    if (!user) return null;

    return {
      User: user,
      Session: session,
    };
  }
}
