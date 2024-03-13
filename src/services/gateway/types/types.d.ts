import { User, Session } from "@prisma/client";
import { ServiceBroker } from "moleculer";

declare module "hyper-express" {
  interface Request {
    session: Session;
    user: User;
    broker: ServiceBroker;
  }
}
