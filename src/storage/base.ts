import Realm, { ObjectClass, ObjectSchema } from 'realm';

const FriendSchema: ObjectSchema = {
  name: 'Friend',
  primaryKey: 'fid',
  properties: {
    uid: { type: 'int', indexed: true },
    fid: { type: 'int', indexed: true },
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

const UserFriendSchema: ObjectSchema = {
  name: 'UserFriend',
  primaryKey: 'uid',
  properties: {
    uid: { type: 'int', indexed: true },
    data: { type: 'string' },
  },
};

const MessageSchema = {
  name: 'Message',
  primaryKey: 'hash',
  properties: {
    uid: { type: 'int', indexed: true },
    fid: { type: 'int', indexed: true },
    hash: { type: 'string', indexed: true },
    dist_type: { type: 'int' },
    content_type: { type: 'string' },
    content: { type: 'string' },
    create_time: { type: 'int' },
    is_received: { type: 'int', optional: true },
    is_sent: { type: 'int', optional: true },
    status: { type: 'int', optional: true },
    is_owner: { type: 'int' },
  },
};

const RecentMessageSchema = {
  name: 'RecentMessage',
  primaryKey: 'uid',
  properties: {
    uid: { type: 'int', indexed: true },
    data: { type: 'string' },
  },
};

export default class Storage {
  private realm!: Realm;
  private schema: (ObjectClass | ObjectSchema)[] = [FriendSchema, UserFriendSchema, MessageSchema, RecentMessageSchema];
  private version: number = 11;

  constructor() {
    this.init();
  }

  public close() {
    this.realm.close();
  }

  private async init() {
    if (!this.realm || this.realm.isClosed) {
      this.realm = await Realm.open({ schema: this.schema, schemaVersion: this.version });
    }
  }

  public deleteAll() {
    return this.query((realm) => {
      realm.deleteAll();
    });
  }

  protected async query<T>(callback: (realm: Realm) => Promise<T> | T): Promise<T> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.realm.write(async () => {
        try {
          const res = await callback(this.realm);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
