import db from '../db';

export interface ITask {
  id: number;
  title: string;
  description: string;
  columnId: number | null;
}

export interface ITaskWithUsers extends ITask {
  assignedUsers: number[];
}

export abstract class Task {
  public static async getAll() {
    const [tasks, assignments] = await Promise.all([
      db.query<ITaskWithUsers[]>('SELECT * FROM tasks'),
      db.query<{ userId: number; taskId: number }[]>(
        'SELECT * from tasks_to_users'
      )
    ]);

    assignments.map((assignment) => {
      const index = tasks.findIndex((task) => task.id === assignment.taskId);
      if (index < 0) {
        return;
      }

      if (tasks[index].assignedUsers) {
        tasks[index].assignedUsers.push(assignment.userId);
      } else {
        tasks[index].assignedUsers = [assignment.userId];
      }
    });

    return tasks;
  }

  public static async getOne(id: number) {
    const tasks = await db.query<ITask[]>(
      'SELECT * FROM tasks WHERE id=? LIMIT 1',
      [id]
    );

    if (tasks.length == 0) return;

    return {
      ...tasks[0],
      assignedUsers: (await db.query<{ id: number }[]>(
        'SELECT id FROM users INNER JOIN tasks_to_users ON tasks_to_users.userId=users.id AND tasks_to_users.taskId=?',
        [id]
      )).map((row) => row.id)
    };
  }

  public static async create(task: ITaskWithUsers) {
    const { id, assignedUsers, ...data } = task;

    const res = await db.query('INSERT INTO tasks SET ?', [data]);

    const uniqueAssignedUsers = assignedUsers.filter(
      (v, i, a) => a.indexOf(v) === i
    );

    await Promise.all(
      uniqueAssignedUsers.map((userId) =>
        db.query('INSERT INTO tasks_to_users SET taskId=?, userId=?', [
          res.insertId,
          userId
        ])
      )
    );

    return {
      id: res.insertId,
      assignedUsers: uniqueAssignedUsers,
      ...data
    };
  }

  public static async update(task: ITaskWithUsers) {
    const { id, assignedUsers, ...data } = task;

    await db.query('UPDATE tasks SET ? WHERE id=?', [data, id]);

    const uniqueAssignedUsers = assignedUsers.filter(
      (v, i, a) => a.indexOf(v) === i
    );

    const currentlyAssigned = (await db.query<{ userId: number }[]>(
      'SELECT userId FROM tasks_to_users WHERE taskId=?',
      [id]
    )).map((v) => v.userId);

    const usersToAdd = uniqueAssignedUsers.filter(
      (userId) => !currentlyAssigned.some((v) => v === userId)
    );

    const usersToRemove = currentlyAssigned.filter(
      (userId) => !uniqueAssignedUsers.some((v) => v === userId)
    );

    await Promise.all(
      usersToAdd
        .map((userId) =>
          db.query('INSERT INTO tasks_to_users SET taskId=?, userId=?', [
            id,
            userId
          ])
        )
        .concat(
          usersToRemove.map((userId) =>
            db.query('DELETE FROM tasks_to_users WHERE taskId=? AND userId=?', [
              id,
              userId
            ])
          )
        )
    );
  }

  public static async addUser(taskId: number, userId: number) {
    await db.query('INSERT INTO tasks_to_users SET taskId=?, userId=?', [
      taskId,
      userId
    ]);
  }

  public static async removeUser(taskId: number, userId: number) {
    await db.query('DELETE FROM tasks_to_users WHERE taskId=? AND userId=?', [
      taskId,
      userId
    ]);
  }

  public static async delete(id: number) {
    await db.query('DELETE FROM tasks WHERE id=?', [id]);
  }
}
