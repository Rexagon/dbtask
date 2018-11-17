import db from "../db";
import { ITask } from "./task";
import { IUser } from "./user";
import { inRange } from "../stuff";

export interface IColumn {
  id: number;
  name: string;
}

export abstract class Column {
  public static validate(column: IColumn) {
    return {
      isIdInvalid: column.id == null,
      isNameInvalid: column.name == null || !inRange(column.name, 1, 255)
    };
  }

  public static async getAll() {
    return await db.query("SELECT * FROM columns");
  }

  public static async getOne(id: number) {
    const [columns, tasks] = await Promise.all([
      db.query<IColumn[]>("SELECT * FROM columns WHERE id=?", [id]),
      db.query<ITask[]>("SELECT * FROM tasks WHERE columnId=?", [id])
    ]);

    if (columns.length == 0) return;

    return {
      ...columns[0],
      tasks: await Promise.all(
        tasks.map(async task => {
          const assignedUsers = (await db.query<IUser[]>(
            "SELECT * FROM users INNER JOIN tasks_to_users ON tasks_to_users.userId=users.id AND tasks_to_users.taskId=?",
            [task.id]
          )).map(user => ({
            ...user,
            password: undefined
          }));

          return {
            ...task,
            assignedUsers
          };
        })
      )
    };
  }

  public static async create(column: IColumn) {
    const { id, ...data } = column;

    const res = await db.query("INSERT INTO columns SET ?", [data]);

    return {
      ...data,
      id: res.insertId
    };
  }

  public static async update(column: IColumn) {
    const { id, ...data } = column;

    await db.query("UPDATE columns SET ? WHERE id=?", [data, id]);
  }

  public static async delete(id: number) {
    await db.query("DELETE FROM columns WHERE id=?", [id]);
  }
}
