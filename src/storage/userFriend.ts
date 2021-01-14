import Realm from 'realm';
import Storage from './base';

class UserFriendStorage extends Storage {
  getData(uid: number): Promise<{ key: string; list: number[] }[]> {
    return this.query((realm) => {
      const dataList = realm.objects('UserFriend');
      const data = dataList.filtered(`uid = ${uid}`);
      if (!data || !data[0]) {
        return [];
      }
      return JSON.parse((data[0] as any).data);
    });
  }

  saveData(uid: number, data: { key: string; list: number[] }[]) {
    this.query((realm) => {
      realm.create('UserFriend', { uid, data: JSON.stringify(data) }, Realm.UpdateMode.All);
    });
  }

  removeData(uid: number) {
    return this.query(async (realm) => {
      const data = await this.getData(uid);
      data && realm.delete(data);
    });
  }
}

export default new UserFriendStorage();
