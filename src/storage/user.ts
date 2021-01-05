import Realm from 'realm';
import Storage from './base';

const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    is_current: { type: 'int', default: 0, optional: true },
    id: { type: 'int', indexed: true },
    token: { type: 'string' },
    avatar: { type: 'string' },
    client_id: { type: 'string' },
    client_type: { type: 'string' },
    nickname: { type: 'string' },
    mobile: { type: 'int' },
    sex: { type: 'int' },
    status: { type: 'int' },
  },
};

class UserStorage extends Storage {
  constructor() {
    super([UserSchema]);
  }

  saveUser(user: User, update = false) {
    this.query((realm) => {
      realm.create('User', user, update ? Realm.UpdateMode.Modified : Realm.UpdateMode.All);
    });
  }

  deleteUser(id: number) {
    return this.query(async (realm) => {
      const user = await this.getUser(id);
      user && realm.delete(user);
    });
  }

  getUser(id: number) {
    return this.query((realm) => {
      const userList = realm.objects('User');
      const user = userList.filtered(`id = ${id}`);
      return user && user[1];
    });
  }

  getAuthUser(): Promise<User[] | null> {
    return this.query((realm) => {
      const userList = realm.objects('User');
      if (!userList) {
        return null;
      }
      const user = userList.filtered('is_current = 1 AND token != ""');
      return user as any;
    });
  }
}

export default new UserStorage();
