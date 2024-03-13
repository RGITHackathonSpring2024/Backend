import hyperExpress from "hyper-express";
import { Service } from "moleculer";
import { MoleculerService, MoleculerServiceStarted } from "moleculer-plus";
import { RegisterUserDto } from "../users/dtos/RegisterUser.dto";
import { Session, User } from "@prisma/client";
import { LoginUserDto } from "../users/dtos/LoginUser.dto";
import { LoginSessionUserDto } from "../users/dtos/LoginSessionUser.dto";
import { FindUserByLoginDto } from "../users/dtos/FindUserByLogin.dto";
import { authMiddleware } from "./middleware/authMiddleware";

@MoleculerService({ name: "gateway" })
export default class GatewayService extends Service {
  private app: hyperExpress.Server;
  @MoleculerServiceStarted()
  public Started() {
    this.app = new hyperExpress.Server();

    this.app.use((req, res, next) => {req.broker = this.broker; next()})
    this.UseErrorHandler();
    this.UseUsersRoutes();

    this.app.listen(6942).then(() => {
        this.logger.info(`Gateway started on server started on 6942`);
    });
  }

  private UseUsersRoutes() {
    this.app.post("/users/register", async (req, res) => {
        const {Login, Password} = await req.json();

        const data = await this.broker.call<User | null, RegisterUserDto>("users.register-user", {Login, Password});
        if (data != null) {
            const session = await this.broker.call<Session | null, LoginSessionUserDto>("users.login-user-session", {UserIdentifier: data.Identifier});
            if (session != null) {
                return res.status(200).json({
                    User: data,
                    Token: session.Token,
                    SessionId: session.Identifier,
                    UserId: session.UserID
                });
            }
            else {
                return res.status(500).json({error: "Unreachable."});
            }
        }
        else {
            return res.status(500).json({error: "Unreachable."});
        }
    });

    this.app.post("/users/login", async (req, res) => {
        const {Login, Password} = await req.json();

        const session = await this.broker.call<Session | null, LoginUserDto>("users.login-user", {Login, Password});
        if (session != null) {
            const user = await this.broker.call<User | null, FindUserByLoginDto>("users.find-user-by-login", {Login});
            if (user != null) {
                return res.status(200).json({
                    User: user,
                    Token: session.Token,
                    SessionId: session.Identifier,
                    UserId: session.UserID
                });
            }
            return res.status(500).json({error: "Unreachable."});
        }
        else {
            return res.status(500).json({error: "Unreachable."});
        }
    });

    this.app.get("/users/me", authMiddleware, (req, res) => res.status(200).json({User: req.user}));
  }

  public UseErrorHandler() {
    this.app.set_error_handler((req, res, err: Error) => {
        if (err.message === "userError")
            return console.error(err)

        if (err) {
            res.json({
                StatusCode: res.statusCode,
                Error: err.message || "Internal Server Error"
            })
        }
    })
  }
}
