import db from "../db";
import { IUser } from "./user";

export interface IGroup {
  id: number;
  name: string;
}

export abstract class Group {
  public static async getAll() {
    return await db.query<IGroup[]>("SELECT * FROM `groups`");
  }

  public static async getOne(id: number) {
    const [groups, users] = await Promise.all([
      db.query<IGroup[]>("SELECT * FROM `groups` WHERE id=? LIMIT 1", [id]),
      db.query<IUser[]>("SELECT * FROM users WHERE groupId=?", [id])
    ]);

    if (groups.length == 0) return;

    return {
      ...groups[0],
      users: users.map(user => ({
        ...user,
        password: undefined
      }))
    };
  }

  public static async create(group: IGroup) {
    const { id, ...data } = group;

    const res = await db.query("INSERT INTO `groups` SET ?", [data]);

    return {
      ...data,
      id: res.insertId
    };
  }

  public static async update(group: IGroup) {
    const { id, ...data } = group;

    await db.query("UPDATE `groups` SET ? WHERE id=?", [data, group.id]);
  }

  public static async delete(id: number) {
    await db.query("DELETE FROM `groups` WHERE id=?", [id]);
  }
}
