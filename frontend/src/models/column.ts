import axios from 'axios';
import Vue from 'vue';

import { EventProducer } from './event';

export interface IColumnData {
  id?: number;
  name: string;
}

export class Column implements IColumnData {
  public id?: number;
  public name: string = '';

  constructor(data?: IColumnData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
  }
}

export class ColumnManager extends EventProducer {
  public columns: Column[] = [];

  constructor() {
    super();
  }

  public async fetchAll() {
    const res = await axios.get<IColumnData[]>('columns');

    this.columns = res.data.map((data) => new Column(data));

    this.notify('fetched', this.columns);
  }

  public async create(name: string) {
    const res = await axios.post<IColumnData>('columns', { name });

    const column = new Column(res.data);
    this.columns.push(column);

    this.notify('created', column);
  }

  public async update(data: IColumnData) {
    await axios.put('columns', data);

    const index = this.columns.findIndex((col) => col.id === data.id);

    if (index < 0) {
      return;
    }

    Vue.set(this.columns, index, new Column(data));

    this.notify('updated', this.columns[index]);
  }

  public async delete(id: number) {
    await axios.delete(`columns/${id}`);

    const index = this.columns.findIndex((col) => col.id === id);

    if (index < 0) {
      return;
    }

    Vue.delete(this.columns, index);

    this.notify('removed', id);
  }
}
