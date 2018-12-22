import axios from 'axios';

import { filter } from 'rxjs/operators';

import { State } from './state';
import { Event, EventProducer } from './event';
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

export class TaskManager extends EventProducer {
  public tasks: Task[] = [];

  constructor(state: State) {
    super();

    state.columnManager.eventBus
      .pipe(filter((event) => event.type === 'removed'))
      .subscribe((event: Event<number>) => {
        this.tasks.map((task) => {
          if (task.columnId === event.data) {
            task.columnId = undefined;
          }
        });

        this.notify('fetched', this.tasks);
      });
  }

  public async fetchAll() {
    const res = await axios.get<ITaskData[]>('tasks');

    this.tasks = res.data.map((data) => new Task(data));

    this.notify('fetched', this.tasks);
  }

  public async fetchOne(id: number) {
    const res = await axios.get<ITaskData>(`tasks/${id}`);

    const index = this.tasks.findIndex((task) => task.id === id);

    const task = new Task(res.data);

    if (index < 0) {
      this.tasks.push(task);
    } else {
      this.tasks[index] = task;
    }

    this.notify('updated', task);
  }

  public async create(data: ITaskData) {
    const res = await axios.post<ITaskData>('tasks', data);

    const task = new Task(res.data);
    this.tasks.push(task);

    this.notify('created', task);
  }

  public async update(data: ITaskData) {
    await axios.put('tasks', data);

    const index = this.tasks.findIndex((task) => task.id === data.id);

    if (index < 0) {
      return;
    }

    this.tasks[index] = new Task(data);

    this.notify('updated', this.tasks[index]);
  }

  public async delete(id: number) {
    await axios.delete(`tasks/${id}`);

    const index = this.tasks.findIndex((task) => task.id === id);

    if (index < 0) {
      return;
    }

    this.tasks.splice(index, 1);

    this.notify('removed', id);
  }

  public async addUser(taskId: number, userId: number) {
    await axios.post(`tasks/${taskId}/users/${userId}`);
    await this.fetchOne(taskId);
  }

  public async removeUser(taskId: number, userId: number) {
    await axios.delete(`tasks/${taskId}/users/${userId}`);
    await this.fetchOne(taskId);
  }
}
