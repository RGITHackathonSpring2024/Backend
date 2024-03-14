import { Router } from "hyper-express";
import { authMiddleware } from "../middleware/authMiddleware";
import { LoginUserDto } from "../../users/dtos/LoginUser.dto";
import { Session, User } from "@prisma/client";
import { FindUserByLoginDto } from "../../users/dtos/FindUserByLogin.dto";
import { RegisterUserDto } from "../../users/dtos/RegisterUser.dto";
import { LoginSessionUserDto } from "../../users/dtos/LoginSessionUser.dto";

const router = new Router();
export default router;

router.post("/users/register", async (req, res) => {
  const { Login, Password } = await req.json();

  const data = await req.broker.call<User | null, RegisterUserDto>(
    "users.register-user",
    { Login, Password }
  );
  if (data != null) {
    const session = await req.broker.call<Session | null, LoginSessionUserDto>(
      "users.login-user-session",
      { UserIdentifier: data.Identifier }
    );
    if (session != null) {
      return res.status(200).json({
        User: data,
        Token: session.Token,
        SessionId: session.Identifier,
        UserId: session.UserID,
      });
    } else {
      return res.status(500).json({ error: "Unreachable." });
    }
  } else {
    return res.status(500).json({ error: "Unreachable." });
  }
});

router.post("/users/login", async (req, res) => {
  const { Login, Password } = await req.json();

  const session = await req.broker.call<Session | null, LoginUserDto>(
    "users.login-user",
    { Login, Password }
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

router.get("/users/me", authMiddleware, (req, res) =>
  res.status(200).json({ User: req.user })
);
