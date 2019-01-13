import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import db from './db';
import userController from './controllers/user';
import taskController from './controllers/task';
import columnController from './controllers/column';
import { validateAccessToken } from './stuff';

const config = require('./config');

const publicPages = ['/api/signin', '/api/signup'];

db.init(config.sql);

const app = express();

app.set('port', process.env.port || 17400);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  if (publicPages.some((v) => v == req.path)) {
    next();
    return;
  }

  try {
    if (req.headers.authorization == null) throw new Error();

    if (!validateAccessToken(req.headers.authorization)) {
      throw new Error();
    }

    next();
  } catch (err) {
    res.sendStatus(401);
  }
});

app.use('/api/', userController);
app.use('/api/', taskController);
app.use('/api/', columnController);

export default app;
