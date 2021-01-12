import Realm from 'realm';
import { MessageRecord } from '@/types/interface/entity';
import Storage from './base';

export interface Message extends MessageRecord {
  id?: number;
  fid: number;
  owner_id: number;
}

class MessageStorage extends Storage {
  saveMessage(message: Message, update = false) {
    this.query((realm) => {
      realm.create('Message', message, update ? Realm.UpdateMode.Modified : Realm.UpdateMode.All);
    });
  }

  getMessageByFid(owner_id: number, fid: number, limit = 50): Promise<Realm.Results<Message>> {
    return this.query((realm) => {
      const messages = realm
        .objects('Message')
        .filtered(`owner_id = ${owner_id} AND fid = ${fid} LIMIT (${limit})`)
        .sorted('create_time');
      return messages as any;
    });
  }

  getMessage(hash: string) {
    return this.query((realm) => {
      const userList = realm.objects('Message');
      const user = userList.filtered(`hash = ${hash}`);
      return user && user[1];
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
