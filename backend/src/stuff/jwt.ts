import crypto from 'crypto';

import { Base64 } from './base64';
import { IUser } from 'src/models/user';

const JWT_KEY = require('../config').jwtKey;

export interface IAccessToken {
  userId: number;
  groupId: number | null;
  iss: number;
  exp: number;
}

const signData = (data: string) =>
  Base64.urlEncode(
    crypto
      .createHmac('sha256', JWT_KEY)
      .update(data)
      .digest('base64')
  );

export const createAccessToken = (user: IUser) => {
  const accessToken = Base64.urlEncode(
    JSON.stringify(<IAccessToken>{
      userId: user.id,
      groupId: user.groupId,
      iss: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000
    })
  );

  return `${accessToken}.${signData(accessToken)}`;
};

export const validateAccessToken = (accessToken: string) => {
  const regex = /^(?:Bearer )?([\w\d]+)\.([\w\d]+)$/;
  const matchingResult = regex.exec(accessToken);

  if (matchingResult == null) {
    return false;
  }

  const [, data, signature] = matchingResult;

  return signData(data) === signature;
};

export const parseAccessToken = (accessToken: string) => {
  const regex = /^(?:Bearer )?([\w\d]+)\.([\w\d]+)$/;
  const matchingResult = regex.exec(accessToken);

  if (matchingResult == null) {
    return null;
  }

  const [, data, signature] = matchingResult;

  try {
    return JSON.parse(Base64.urlDecode(data)) as IAccessToken;
  } catch (e) {
    return null;
  }
};
