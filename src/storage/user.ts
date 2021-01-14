import Realm from 'realm';
import { Friend } from '@/types/interface/user';
import Storage from './base';

export type FriendInfo = Friend & {
  uid: number;
};

class FriendStorage extends Storage {
  saveFriendList(list: FriendInfo[]) {
    this.query((realm) => {
      list.forEach((user) => {
        realm.create('Friend', user, Realm.UpdateMode.All);
      });
    });
  }

  saveFriend(user: FriendInfo, update = false) {
    this.query((realm) => {
      realm.create('Friend', user, update ? Realm.UpdateMode.Modified : Realm.UpdateMode.All);
    });
  }

  deleteFriend(uid: number, fid: number) {
    return this.query(async (realm) => {
      const friend = await this.getFriend(uid, fid);
      friend && realm.delete(friend);
    });
  }

  getFriend(uid: number, fid: number) {
    return this.query((realm) => {
      const friendList = realm.objects('Friend');
      const friend = friendList.filtered(`uid = ${uid} AND fid = ${fid}`);
      return friend && friend[0];
    });
  }

  getAllFriend(uid: number) {
    return this.query((realm) => {
      const friendList = realm.objects('Friend');
      const friend = friendList.filtered(`uid = ${uid}`);
      return friend;
    });
  }
}

export default new FriendStorage();
