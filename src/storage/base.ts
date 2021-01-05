import Realm, { ObjectClass, ObjectSchema } from 'realm';

export default class Storage {
  private realm!: Realm;
  private schema: (ObjectClass | ObjectSchema)[];

  constructor(schema: (ObjectClass | ObjectSchema)[]) {
    this.schema = schema;
    this.init();
  }

  private async init() {
    if (!this.realm || this.realm.isClosed) {
      this.realm = await Realm.open({ schema: this.schema, schemaVersion: 6 });
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
