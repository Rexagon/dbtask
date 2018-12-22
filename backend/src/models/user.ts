import db from '../db';
import { inRange } from '../stuff';

export interface IUser {
  id: number;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  groupId: number;
}

export abstract class User {
  public static checkLoginInvalid(login: string) {
    return login == null || !inRange(login, 4, 255);
  }

  public static checkPasswordInvalid(password: string) {
    return password == null || !inRange(password, 8, 32);
  }

  public static validate(user: IUser) {
    return {
      isIdInvalid: user.id == null,
      isLoginInvalid: this.checkLoginInvalid(user.login),
      isPasswordInvalid: this.checkPasswordInvalid(user.password),
      isFirstNameInvalid:
        user.firstName == null || !inRange(user.firstName, 1, 255),
      isLastNameInvalid: user.lastName == null || !inRange(user.lastName, 1, 255)
    };
  }

  public static async getAll() {
    const users = await db.query<IUser[]>('SELECT * FROM users');

    return users.map((user) => ({
      ...user,
      password: undefined
    }));
  }

  public static async getOne(id: number) {
    const users = await db.query<IUser[]>(
      `SELECT * FROM users WHERE id=? LIMIT 1`,
      [id]
    );

    if (users.length == 0) return;

    return {
      ...users[0],
      password: undefined
    };
  }

  public static async getByLogin(login: string) {
    return (await db.query<IUser[]>(
      `SELECT * FROM users WHERE login=? LIMIT 1`,
      [login]
    ))[0];
  }

  public static async create(user: IUser) {
    const { id, ...data } = user;

    const res = await db.query('INSERT INTO users SET ?', [data]);

    return {
      ...data,
      id: res.insertId,
      password: undefined
    };
  }

  public static async update(user: IUser) {
    const { id, login, password, ...data } = user;

    await db.query('UPDATE users SET ? WHERE id=?', [data, id]);
  }

  public static async delete(id: number) {
    await db.query('DELETE FROM users WHERE id=?', [id]);
  }
}
