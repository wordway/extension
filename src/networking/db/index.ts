import Low from 'lowdb/lib/Low';
import LocalForageAdapter from './LocalForageAdapter';

interface IData {
  messages: string[];
}

const adapter = new LocalForageAdapter('_db');
const sharedDb = new Low<IData>(adapter);

sharedDb.read().then(() => {
  if (sharedDb.data == null) {
    sharedDb.data = { messages: [] };
    sharedDb.write();
  }
});

export { sharedDb };
