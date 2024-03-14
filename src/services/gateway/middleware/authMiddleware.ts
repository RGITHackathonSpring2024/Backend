import { MiddlewareNext, Request, Response } from "hyper-express";
import { CheckSessionByTokenDto } from "../../users/dtos/CheckSessionByToken.dto";
import { Session, User } from "@prisma/client";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: MiddlewareNext
) {
  const auth = req.header("Authorization");
  if (!auth || auth.split(" ").length !== 2)
    return next(new Error("Authorization header invalid"));
  const token = auth.split(" ")[1];
  const session = await req.broker.call<
    { User: User; Session: Session } | null,
    CheckSessionByTokenDto
  >("users.check-session", { Token: token });
  if (!session) return next(new Error("Authorization header invalid"));
  req.user = session.User;
  req.session = session.Session;
  next();
}
