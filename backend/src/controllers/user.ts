import express from "express";
import bcrypt from "bcrypt";

import db from "../db";
import { IUser } from "../models/user";
import { inRange, genErrResponse } from "../stuff";

const router = express.Router();

const userValidator = (user: IUser) => {
  return {
    isIdInvalid: user.id == null,
    isLoginInvalid: user.login == null || !inRange(user.login, 4, 255),
    isPasswordInvalid: user.password == null || !inRange(user.password, 8, 32),
    isFirstNameInvalid:
      user.firstName == null || !inRange(user.firstName, 1, 255),
    isLastNameInvalid: user.lastName == null || !inRange(user.lastName, 1, 255)
  };
};

// GET /api/users //
////////////////////

router.get("/users", async (req, res) => {
  try {
    const users = await db.query<IUser[]>("SELECT * FROM users");

    res.json(
      users.map(user => ({
        ...user,
        password: undefined
      }))
    );
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

// POST /api/users //
////////////////////

router.post("/users", async (req, res) => {
  const user = req.body as IUser;
  const validated = userValidator(user);

  if (
    validated.isLoginInvalid ||
    validated.isPasswordInvalid ||
    validated.isFirstNameInvalid ||
    validated.isLastNameInvalid
  ) {
    res.json(genErrResponse("InvalidData"));
    return;
  }

  delete user.id;
  user.password = await bcrypt.hash(user.password, 10);

  try {
    const dbres = await db.query("INSERT INTO users SET ?", [user]);
    res.json({
      ...user,
      password: undefined,
      id: dbres.insertId
    });
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

export default router;
