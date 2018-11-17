import db from "../db";
import { IUser } from "./user";

export interface ITask {
  id: number;
  title: string;
  description: string;
  columnId: number;
}

export abstract class Task {
  public static async getAll() {
    return await db.query<ITask[]>("SELECT * FROM tasks");
  }

  public static async getOne(id: number) {
    const tasks = await db.query<ITask[]>(
      "SELECT * FROM tasks WHERE id=? LIMIT 1",
      [id]
    );

    if (tasks.length == 0) return;

    return {
      ...tasks[0],
      assignedUsers: (await db.query<IUser[]>(
        "SELECT * FROM users INNER JOIN tasks_to_users ON tasks_to_users.userId=users.id AND tasks_to_users.taskId=?",
        [id]
      )).map(user => ({
        ...user,
        password: undefined
      }))
    };
  }

  public static async create(task: ITask) {
    const { id, ...data } = task;

    const res = await db.query("INSERT INTO tasks SET ?", [data]);

    return {
      ...data,
      id: res.insertId
    };
  }

  public static async update(task: ITask) {
    const { id, ...data } = task;

    await db.query("UPDATE tasks SET ? WHERE id=?", [data, task.id]);
  }

  public static async delete(id: number) {
    await db.query("DELETE FROM tasks WHERE id=?", [id]);
  }
}
