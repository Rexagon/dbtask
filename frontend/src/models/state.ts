import axios from 'axios';

import { UserManager } from './user';
import { TaskManager } from './task';
import { ColumnManager } from './column';

export class State {
  public userManager: UserManager;
  public taskManager: TaskManager;
  public columnManager: ColumnManager;

  constructor() {
    this.userManager = new UserManager();
    this.taskManager = new TaskManager();
    this.columnManager = new ColumnManager();
  }
}

const state = new State();
export default state;
