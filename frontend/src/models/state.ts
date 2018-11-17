import axios from 'axios';
import { ColumnManager } from './column';

export class State {
  public columnManager: ColumnManager;

  constructor() {
    axios.defaults.headers.common.Authorization =
      'Bearer eyJncm91cElkIjpudWxsLCJpc3MiOjE1NDI0ODI4MDgyMDYsImV4cCI6MTU0MjU2OTIwODIwNn0.ZEFSS0dXR2o2UVZNeEE2ekg2bDU0OG1Ba3pyM25sSXhXZVdWMWUyWDBKYz0';

    this.columnManager = new ColumnManager();
  }
}

const state = new State();
export default state;
