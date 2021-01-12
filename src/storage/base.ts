import Realm, { ObjectClass, ObjectSchema } from 'realm';

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

const MessageSchema = {
  name: 'Message',
  primaryKey: 'hash',
  properties: {
    owner_id: { type: 'int', indexed: true },
    fid: { type: 'int', indexed: true },
    hash: { type: 'string', indexed: true },
    user_id: { type: 'int' },
    dist_id: { type: 'int' },
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

export default class Storage {
  private realm!: Realm;
  private schema: (ObjectClass | ObjectSchema)[] = [UserSchema, MessageSchema];
  private version: number = 10;

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
