import axios from 'axios';
import { EventProducer } from './event';

const LOCAL_STORAGE_ACCESS_TOKEN = 'access-token';
const LOCAL_STORAGE_USER_DATA = 'user-data';

export interface ISignInData {
  login: string;
  password: string;
}

export interface IUserData {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  groupId: number;
}

export class User implements IUserData {
  public id: number;
  public login: string;
  public firstName: string;
  public lastName: string;
  public groupId: number;

  constructor(data: IUserData) {
    this.id = data.id;
    this.login = data.login;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.groupId = data.groupId;
  }
}

export class UserManager extends EventProducer {
  public currentUser: User | null = null;

  public users: User[] = [];

  constructor() {
    super();
    this.restoreData();
  }

  public async signIn(data: ISignInData) {
    const res = await axios.post<{
      user: IUserData;
      accessToken: string;
    }>('signin', data);

    this.storeData(res.data.accessToken, res.data.user);
  }

  public async signOut() {
    this.storeData();
  }

  public async fetchAll() {
    const res = await axios.get<IUserData[]>('users');

    this.users = res.data.map((user) => new User(user));

    this.notify('fetched', this.users);
  }

  private storeData(token?: string, userData?: IUserData) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
    }

    if (userData) {
      this.currentUser = new User(userData);
      localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(userData));
    } else {
      this.currentUser = null;
      localStorage.removeItem(LOCAL_STORAGE_USER_DATA);
    }
  }

  private restoreData() {
    const accessToken =
      localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) || undefined;

    let userData: IUserData | undefined;
    const savedUserData =
      localStorage.getItem(LOCAL_STORAGE_USER_DATA) || undefined;
    if (savedUserData) {
      userData = JSON.parse(savedUserData) as IUserData;
    }

    this.storeData(accessToken, userData);
  }
}
