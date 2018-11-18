import axios from 'axios';

import { UserManager } from './user';
import { ColumnManager } from './column';

export class State {
  public userManager: UserManager;
  public columnManager: ColumnManager;

  constructor() {
    this.userManager = new UserManager();
    this.columnManager = new ColumnManager();
  }
}

const state = new State();
export default state;
