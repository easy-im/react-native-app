import Realm, { ObjectClass, ObjectSchema } from 'realm';

export default class Storage {
  private schema: (ObjectClass | ObjectSchema)[];

  constructor(schema: (ObjectClass | ObjectSchema)[]) {
    this.schema = schema;
  }

  protected async query<T>(callback: (realm: Realm) => Promise<T> | T): Promise<T> {
    const realm = await Realm.open({ schema: this.schema, schemaVersion: 1 });
    return new Promise((resolve, reject) => {
      realm.write(async () => {
        try {
          const res = await callback(realm);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
