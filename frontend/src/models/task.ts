import axios from 'axios';
import Vue from 'vue';
import Bus from '@/bus';
import { IUserData } from './user';

export interface ITaskData {
  id: number;
  title: string;
  description: string;
  columnId?: number;
  assignedUsers?: IUserData[];
}

export class Task implements ITaskData {
  public id: number = 0;
  public title: string = '';
  public description: string = '';
  public columnId?: number;
  public assignedUsers?: IUserData[];

  constructor(data?: ITaskData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.columnId = data.columnId;
    this.assignedUsers = data.assignedUsers;
  }
}

export class TaskManager {
  public tasks: Task[] = [];

  constructor() {
    Bus.on('column-deleted', (id: number) => {
      this.tasks.map((task) => {
        if (task.columnId === id) {
          task.columnId = undefined;
        }
      });
      this.notify();
    });
  }

  public async fetchAll() {
    const res = await axios.get<ITaskData[]>('tasks');

    this.tasks = res.data.map((data) => new Task(data));
    this.notify();
  }

  public async fetchOne(id: number) {
    const res = await axios.get<ITaskData>(`tasks/${id}`);

    const task = new Task(res.data);
    console.log(task);
    Vue.set(this.tasks, this.tasks.findIndex((v) => v.id === id), task);
    this.notify();
  }

  public async create(data: ITaskData) {
    const res = await axios.post<ITaskData>('tasks', data);

    const task = new Task(res.data);

    this.tasks.push(task);
    this.notify();
  }

  public async update(data: ITaskData) {
    await axios.put('tasks', data);

    const task = new Task(data);
    Vue.set(this.tasks, this.tasks.findIndex((v) => v.id === data.id), task);
    this.notify();
  }

  public async delete(id: number) {
    await axios.delete(`tasks/${id}`);
    Vue.delete(this.tasks, this.tasks.findIndex((v) => v.id === id));
    this.notify();
  }

  public async addUser(taskId: number, userId: number) {
    await axios.post(`tasks/${taskId}/users/${userId}`);
    await this.fetchOne(taskId);
  }

  public async removeUser(taskId: number, userId: number) {
    await axios.delete(`tasks/${taskId}/users/${userId}`);
    await this.fetchOne(taskId);
  }

  public notify() {
    Bus.fire('tasks-changed', this.tasks);
  }
}
