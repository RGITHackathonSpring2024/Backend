import { MiddlewareNext, Request, Response } from "hyper-express";
import { CheckSessionByTokenDto } from "../../users/dtos/CheckSessionByToken.dto";
import { Session, User } from "@prisma/client";
import { AUTH_SCOPES } from "../../users/dtos/Scopes.dto";

export function scopeMiddlewareOr(...args: AUTH_SCOPES[]) {
  return async function (req: Request, res: Response, next: MiddlewareNext) {
    if (!req.user) return next(new Error("Internal Server Error."));

    for (const arg of args) {
      if (req.session.Scopes.includes(arg)) {
        return next();
      } else {
        return next(
          new Error("You/Your session don't have access to this route.")
        );
      }
    }
  };
}

export function scopeMiddlewareAnd(...args: AUTH_SCOPES[]) {
  return async function (req: Request, res: Response, next: MiddlewareNext) {
    if (!req.user) return next(new Error("Internal Server Error."));

    for (const arg of args) {
      if (!req.session.Scopes.includes(arg)) {
        return next(
          new Error("You/Your session don't have access to this route.")
        );
      }
    }
    return next();
  };
}
