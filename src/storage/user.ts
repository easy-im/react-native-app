import { Friend } from '@/types/interface/user';
import Realm from 'realm';
import Storage from './base';

class UserStorage extends Storage {
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
