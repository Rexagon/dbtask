import express from 'express';
import bodyParser from 'body-parser';

const config = require('./config')

import db from './db';

db.init(config.sql);

const app = express();

app.set('port', process.env.port || 17400);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;