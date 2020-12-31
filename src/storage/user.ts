import Realm from 'realm';
import Storage from './base';

export interface User {
  id: number;
  is_current?: number;
  token: string;
}

const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', indexed: true },
    token: { type: 'string' },
    is_current: { type: 'int', default: 0, optional: true },
  },
};

export default class UserStorage extends Storage {
  constructor() {
    super([UserSchema]);
  }

  saveUser(user: User, update = false) {
    this.query((realm) => {
      realm.create('User', user, update ? Realm.UpdateMode.Modified : Realm.UpdateMode.All);
    });
  }

  getUser(id: number) {
    return this.query((realm) => {
      const userList = realm.objects('User');
      const user = userList.filtered(`id = ${id}`);
      return user;
    });
  }

  getAuthUser(): Promise<User[]> {
    return this.query((realm) => {
      const userList = realm.objects('User');
      const user = userList.filtered('is_current = 1 AND token != ""');
      return user as any;
    });
  }
}
