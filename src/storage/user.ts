import { Friend } from '@/types/interface/user';
import Realm, { ObjectSchema } from 'realm';
import Storage from './base';

const UserSchema: ObjectSchema = {
  name: 'User',
  primaryKey: 'fid',
  properties: {
    fid: { type: 'int' },
    nickname: { type: 'string' },
    remark: { type: 'string' },
    mobile: { type: 'int', optional: true },
    sex: { type: 'int' },
    avatar: { type: 'string' },
    client_id: { type: 'string', optional: true },
    client_type: { type: 'string', optional: true },
    status: { type: 'int' },
  },
};

class UserStorage extends Storage {
  constructor() {
    super('user', 7, [UserSchema]);
  }

  saveUserList(list: Friend[]) {
    this.query((realm) => {
      list.forEach((user) => {
        realm.create('User', user, Realm.UpdateMode.All);
      });
    });
  }

  saveUser(user: Friend, update = false) {
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

  getAllUser() {
    return this.query((realm) => {
      const userList = realm.objects('User');
      return userList;
    });
  }
}

export default new UserStorage();
