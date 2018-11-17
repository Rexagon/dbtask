import express from "express";
import bodyParser from "body-parser";

import db from "./db";
import userController from "./controllers/user";
import taskController from "./controllers/task";
import columnController from "./controllers/column";
import { validateAccessToken } from "./stuff";

const config = require("./config");

const publicPages = ["/api/signin", "/api/signup"];

db.init(config.sql);

const app = express();

app.set("port", process.env.port || 17400);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (publicPages.some(v => v == req.path)) {
    next();
    return;
  }

  try {
    if (req.headers.authorization == null) throw new Error();

    const regex = /Bearer ([\w\d]+\.[\w\d]+)/;
    const matchingResult = regex.exec(req.headers.authorization);

    if (
      matchingResult == null ||
      validateAccessToken(matchingResult[1]) == false
    ) {
      throw new Error();
    }

    next();
  } catch (err) {
    res.sendStatus(403);
  }
});

app.use("/api/", userController);
app.use("/api/", taskController);
app.use("/api/", columnController);

export default app;
