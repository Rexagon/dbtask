import { UserManager } from './user';
import { TaskManager } from './task';
import { ColumnManager } from './column';
import { EventProducer } from './event';

export interface StateEvent {
  type: string;
  data: any;
}

export class State extends EventProducer {
  public userManager: UserManager;
  public taskManager: TaskManager;
  public columnManager: ColumnManager;

  constructor() {
    super();

    this.userManager = new UserManager();
    this.columnManager = new ColumnManager();
    this.taskManager = new TaskManager(this);
  }
}

const state = new State();
export default state;
