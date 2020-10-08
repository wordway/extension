import { IAdapter } from 'lowdb/lib/Low';
import localforage from '../../utils/localforage';

class LocalForageAdapter implements IAdapter {
  public key: string;

  constructor(key: string) {
    this.key = key;
  }

  public async read() {
    const data: any = await localforage.getItem(this.key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  public async write(data: any) {
    await localforage.setItem(this.key, JSON.stringify(data));
    return;
  }
}

export default LocalForageAdapter;
