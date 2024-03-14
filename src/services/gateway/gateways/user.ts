import { Router } from "hyper-express";
import { authMiddleware } from "../middleware/authMiddleware";
import { LoginUserDto } from "../../users/dtos/LoginUser.dto";
import { Session, User } from "@prisma/client";
import { FindUserByLoginDto } from "../../users/dtos/FindUserByLogin.dto";
import { RegisterUserDto } from "../../users/dtos/RegisterUser.dto";
import { LoginSessionUserDto } from "../../users/dtos/LoginSessionUser.dto";
import { scopeMiddlewareOr } from "../middleware/scopeMiddleware";
import { AUTH_SCOPES_ARRAY } from "../../users/dtos/Scopes.dto";

const router = new Router();
export default router;

router.post("/register", async (req, res) => {
  const { Login, Password } = await req.json();

  const data = await req.broker.call<User | null, RegisterUserDto>(
    "users.register-user",
    { Login, Password }
  );
  if (data != null) {
    return res.status(200).json({
      User: data
    });
  } else {
    return res.status(500).json({ error: "Unreachable." });
  }
});

router.post("/login", async (req, res) => {
  const { Login, Password, Scopes } = await req.json();

  const session = await req.broker.call<Session | null, LoginUserDto>(
    "users.login-user",
    { Login, Password, Scopes }
  );
  if (session != null) {
    const user = await req.broker.call<User | null, FindUserByLoginDto>(
      "users.find-user-by-login",
      { Login }
    );
    if (user != null) {
      return res.status(200).json({
        User: user,
        Token: session.Token,
        SessionId: session.Identifier,
        UserId: session.UserID,
      });
    }
    return res.status(500).json({ error: "Unreachable." });
  } else {
    return res.status(500).json({ error: "Unreachable." });
  }
});

router.get("/user/@me", authMiddleware, scopeMiddlewareOr("users.get", "users.get.me"), (req, res) =>
  res.status(200).json({ User: req.user })
);
