import Realm, { ObjectClass, ObjectSchema } from 'realm';

const INSTANCE: Record<string, Realm> = {};

export default class Storage {
  private realm!: Realm;
  private schema: (ObjectClass | ObjectSchema)[];
  private key: string; // 用于标识数据库连接
  private version: number;

  constructor(key: string, version: number, schema: (ObjectClass | ObjectSchema)[]) {
    this.schema = schema;
    this.key = key;
    this.version = version;
    this.init();
  }

  public static closeAll() {
    Object.values(INSTANCE).forEach((realm) => {
      realm.close();
    });
  }

  private async init() {
    if (!this.realm || this.realm.isClosed) {
      this.realm = await Realm.open({ schema: this.schema, schemaVersion: this.version });
      INSTANCE[this.key] = this.realm;
    }
  }

  public close() {
    this.realm.close();
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
