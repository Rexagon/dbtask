import axios from 'axios';
import Vue from 'vue';
import bus from '@/bus';

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

  public async fetchAll() {
    const res = await axios.get<IColumnData[]>('columns');

    this.columns = res.data.map((data) => new Column(data));

    this.notify();
  }

  public async create(name: string) {
    const res = await axios.post<IColumnData>('columns', { name });

    const column = new Column(res.data);

    this.columns.push(column);
    this.notify();
  }

  public async update(data: IColumnData) {
    await axios.put('columns', data);

    const column = new Column(data);
    Vue.set(
      this.columns,
      this.columns.findIndex((v) => v.id === data.id),
      column
    );
    this.notify();
  }

  public async delete(id: number) {
    await axios.delete(`columns/${id}`);
    Vue.delete(this.columns, this.columns.findIndex((v) => v.id === id));
    this.notify();
  }

  public notify() {
    bus.$emit('columns-changed', this.columns);
  }
}
