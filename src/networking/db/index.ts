import Low from 'lowdb/lib/Low';
import LocalForageAdapter from './LocalForageAdapter';

interface IData {
  translationRecords: any[];
  words: any[];
}

const adapter = new LocalForageAdapter('_db');
const sharedDb = new Low<IData>(adapter);

sharedDb.read().then(() => {
  if (sharedDb.data == null) {
    sharedDb.data = { translationRecords: [], words: [] };
  }

  sharedDb.write();
});

export { sharedDb };
