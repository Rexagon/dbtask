import crypto from 'crypto';

import { Base64 } from './base64';
import { IUser } from 'src/models/user';

const JWT_KEY = require('../config').jwtKey;

const signData = (data: string) =>
  Base64.urlEncode(
    crypto
      .createHmac('sha256', JWT_KEY)
      .update(data)
      .digest('base64')
  );

export const createAccessToken = (user: IUser) => {
  const accessToken = Base64.urlEncode(
    JSON.stringify({
      groupId: user.groupId,
      iss: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000
    })
  );

  return `${accessToken}.${signData(accessToken)}`;
};

export const validateAccessToken = (accessToken: string) => {
  const regex = /^([\w\d]+)\.([\w\d]+)$/;
  const matchingResult = regex.exec(accessToken);

  if (matchingResult == null) {
    return false;
  }

  const [, data, signature] = matchingResult;

  return signData(data) === signature;
};
