import axios from 'axios';

export interface IColumnData {
  id: number;
  name: string;
}

export class Column implements IColumnData {
  public id: number = 0;
  public name: string = '';

  constructor(data?: IColumnData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
  }
}

export class ColumnManager {
  public columns: Column[] = [];

  constructor() {}

  public async fetchAll() {
    const res = await axios.get<IColumnData[]>('columns');

    return res.data;
  }
}
