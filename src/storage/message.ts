import Realm from 'realm';
import { MessageRecord } from '@/types/interface/entity';
import Storage from './base';

export type Message = Omit<MessageRecord, 'id' | 'user_id' | 'dist_id'> & {
  uid: number; // 所属用户
  fid: number;
};

class MessageStorage extends Storage {
  saveMessage(message: Message, update = false) {
    this.query((realm) => {
      realm.create('Message', message, update ? Realm.UpdateMode.Modified : Realm.UpdateMode.All);
    });
  }

  getFriendMessageByUid(uid: number, fid: number, limit = 50): Promise<Realm.Results<Message>> {
    return this.query((realm) => {
      const messages = realm
        .objects('Message')
        .filtered(`uid = ${uid} AND fid = ${fid} LIMIT (${limit})`)
        .sorted('create_time');
      return messages as any;
    });
  }

  getMessage(hash: string) {
    return this.query((realm) => {
      const userList = realm.objects('Message');
      const user = userList.filtered(`hash = ${hash}`);
      return user && user[0];
    });
  }

  deleteMessage(hash: string) {
    return this.query(async (realm) => {
      const user = await this.getMessage(hash);
      user && realm.delete(user);
    });
  }
}

export default new MessageStorage();
