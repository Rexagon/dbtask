import { Observable, Subject } from 'rxjs';

export interface IEvent {
  type: string;
  data?: any;
}

export class Event<T> implements IEvent {
  public type: string;
  public data?: T;

  constructor(type: string, data?: T) {
    this.type = type;
    this.data = data;
  }
}

export class EventProducer {
  public readonly eventBus: Observable<IEvent>;

  private _eventBus = new Subject<IEvent>();

  constructor() {
    this.eventBus = this._eventBus.asObservable();
  }

  public notify<T>(type: string, data?: T) {
    this._eventBus.next(new Event(type, data));
  }
}
