import hyperExpress from "hyper-express";
import { Service } from "moleculer";
import { MoleculerService, MoleculerServiceStarted } from "moleculer-plus";
import { RegisterUserDto } from "../users/dtos/RegisterUser.dto";
import { Session, User } from "@prisma/client";
import { LoginUserDto } from "../users/dtos/LoginUser.dto";
import { LoginSessionUserDto } from "../users/dtos/LoginSessionUser.dto";
import { FindUserByLoginDto } from "../users/dtos/FindUserByLogin.dto";
import { authMiddleware } from "./middleware/authMiddleware";
import router from "./gateways/user";

@MoleculerService({ name: "gateway" })
export default class GatewayService extends Service {
  private app: hyperExpress.Server;
  @MoleculerServiceStarted()
  public Started() {
    this.app = new hyperExpress.Server();

    this.UseBrokerHandler();
    this.UseErrorHandler();
    this.UseGateways();

    this.app.listen(6942).then(() => {
      this.logger.info(`Gateway started on server started on 6942`);
    });
  }

  private UseBrokerHandler() {
    this.app.use((req, res, next) => {
      req.broker = this.broker;
      next();
    });
  }

  public UseErrorHandler() {
    this.app.set_error_handler((req, res, err: Error) => {
      if (err.message === "userError") return console.error(err);

      if (err) {
        res.json({
          StatusCode: res.statusCode,
          Error: err.message || "Internal Server Error",
        });
      }
    });
  }

  private UseGateways() {
    this.app.use("/users/", router);
  }
}
