import { IAdapter } from 'lowdb/lib/Low';
import localforage from 'localforage';
import syncDriver from 'localforage-webextensionstorage-driver/sync';

declare var window: any;
window.localforage = localforage;

if (chrome.extension) {
  localforage
    .defineDriver(syncDriver)
    .then(() => localforage.setDriver('webExtensionSyncStorage'));
} else {
  localforage.setDriver(localforage.LOCALSTORAGE);
}

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
