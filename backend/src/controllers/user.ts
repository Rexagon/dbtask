import express from 'express';
import bcrypt from 'bcrypt';

import { IUser, User } from '../models/user';
import { genErrResponse, createAccessToken } from '../stuff';

const router = express.Router();

const SALT_OR_ROUNDS = 10;

// POST /api/signup //
/////////////////////

router.post('/signup', async (req, res) => {
  const user = req.body as IUser;
  const validated = User.validate(user);

  if (
    validated.isLoginInvalid ||
    validated.isPasswordInvalid ||
    validated.isFirstNameInvalid ||
    validated.isLastNameInvalid
  ) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  delete user.id;
  user.password = await bcrypt.hash(user.password, SALT_OR_ROUNDS);

  try {
    res.json(await User.create(user));
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// POST /api/signin //
/////////////////////

router.post('/signin', async (req, res) => {
  const data: {
    login: string;
    password: string;
  } = req.body;

  if (
    User.checkLoginInvalid(data.login) ||
    User.checkPasswordInvalid(data.password)
  ) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    const [hash, user] = await Promise.all([
      bcrypt.hash(data.password, SALT_OR_ROUNDS),
      User.getByLogin(data.login)
    ]);

    if (user == null || (await bcrypt.compare(hash, user.password))) {
      res.json(genErrResponse('InvalidData'));
      return;
    }

    const response = {
      user: {
        ...user,
        password: undefined
      },
      accessToken: createAccessToken(user)
    };

    res.json(response);
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// GET /api/users //
////////////////////

router.get('/users', async (req, res) => {
  try {
    res.json(await User.getAll());
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

// PUT /api/users //
///////////////////

router.put('/users', async (req, res) => {
  const user = req.body as IUser;
  const validated = User.validate(user);

  if (
    validated.isIdInvalid ||
    validated.isFirstNameInvalid ||
    validated.isLastNameInvalid
  ) {
    res.json(genErrResponse('InvalidData'));
    return;
  }

  try {
    await User.update(user);
    res.json({});
  } catch (err) {
    res.json(genErrResponse('DBError', err));
  }
});

export default router;
