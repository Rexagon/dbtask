import express from "express";
import bcrypt from "bcrypt";

import db from "../db";
import { IUser } from "../models/user";
import { inRange, genErrResponse } from "../stuff";

const router = express.Router();

const SALT_OR_ROUNDS = 10;

const checkLoginInvalid = (login: string) =>
  login == null || !inRange(login, 4, 255);

const checkPasswordInvalid = (password: string) =>
  password == null || !inRange(password, 8, 32);

const userValidator = (user: IUser) => {
  return {
    isIdInvalid: user.id == null,
    isLoginInvalid: checkLoginInvalid(user.login),
    isPasswordInvalid: checkPasswordInvalid(user.password),
    isFirstNameInvalid:
      user.firstName == null || !inRange(user.firstName, 1, 255),
    isLastNameInvalid: user.lastName == null || !inRange(user.lastName, 1, 255)
  };
};

// POST /api/signup //
/////////////////////

router.post("/signup", async (req, res) => {
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
  user.password = await bcrypt.hash(user.password, SALT_OR_ROUNDS);

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

// POST /api/signin //
/////////////////////

router.post("/signin", async (req, res) => {
  const data: {
    login: string;
    password: string;
  } = req.body;

  if (checkLoginInvalid(data.login) || checkPasswordInvalid(data.password)) {
    res.json(genErrResponse("InvalidData"));
    return;
  }

  try {
    //TODO: check user and generate accessToken

    res.json({
      accessToken: "none"
    });
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

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

// PUT /api/users //
///////////////////

router.put("/users", async (req, res) => {
  const user = req.body as IUser;
  const validated = userValidator(user);

  if (
    validated.isIdInvalid ||
    validated.isFirstNameInvalid ||
    validated.isLastNameInvalid
  ) {
    res.json(genErrResponse("InvalidData"));
    return;
  }

  try {
    const { id, login, password, ...data } = user;
    await db.query("UPDATE users SET ? WHERE id=?", [data, id]);

    res.json(user);
  } catch (err) {
    res.json(genErrResponse("DBError", err));
  }
});

export default router;
