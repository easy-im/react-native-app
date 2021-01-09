import Realm from 'realm';
import { MessageRecord } from '@/types/interface/entity';
import Storage from './base';

const MessageSchema = {
  name: 'Message',
  primaryKey: 'hash',
  properties: {
    id: { type: 'int', indexed: true, default: 0, optional: true },
    hash: { type: 'string', indexed: true },
    user_id: { type: 'int' },
    dist_id: { type: 'int' },
    dist_type: { type: 'int' },
    content_type: { type: 'string' },
    content: { type: 'string' },
    create_time: { type: 'int' },
    is_received: { type: 'int' },
    is_sent: { type: 'int' },
    status: { type: 'int' },
  },
};

const MessageRecordSchema = {
  name: 'MessageRecord',
  primaryKey: 'fid',
  properties: {
    fid: { type: 'int', indexed: true },
    list: { type: 'list', objectType: 'MessageSchema' },
    last_chat_time: { type: 'int' },
  },
};

class MessageStorage extends Storage {
  constructor() {
    super('message', 1, [MessageSchema, MessageRecordSchema]);
  }

  saveMessage(message: MessageRecord, update = false) {
    this.query((realm) => {
      realm.create('Message', message, update ? Realm.UpdateMode.Modified : Realm.UpdateMode.All);
    });
  }

  deleteMessage(id: number) {
    return this.query(async (realm) => {
      const user = await this.getMessage(id);
      user && realm.delete(user);
    });
  }

  getMessage(id: number) {
    return this.query((realm) => {
      const userList = realm.objects('Message');
      const user = userList.filtered(`id = ${id}`);
      return user && user[1];
    });
  }
}

export default new MessageStorage();
