import express from "express";
import bodyParser from "body-parser";

import db from "./db";
import userController from "./controllers/user";
import taskController from "./controllers/task";

const config = require("./config");

db.init(config.sql);

const app = express();

app.set("port", process.env.port || 17400);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/", userController);
app.use("/api/", taskController);

export default app;
