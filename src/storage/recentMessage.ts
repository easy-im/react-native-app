import Realm from 'realm';
import Storage from './base';

class RecentMessageStorage extends Storage {
  getData(uid: number): Promise<{ fid: number; last_message: string; unreadNumber: number }[]> {
    return this.query((realm) => {
      const dataList = realm.objects('RecentMessage');
      const data = dataList.filtered(`uid = ${uid}`);
      if (!data || !data[0]) {
        return [];
      }
      return JSON.parse((data[0] as any).data);
    });
  }

  saveData(uid: number, data: { fid: number; last_message: string; unreadNumber: number }[]) {
    this.query((realm) => {
      realm.create('RecentMessage', { uid, data: JSON.stringify(data) }, Realm.UpdateMode.All);
    });
  }

  removeData(uid: number) {
    return this.query(async (realm) => {
      const data = await this.getData(uid);
      data && realm.delete(data);
    });
  }
}

export default new RecentMessageStorage();
