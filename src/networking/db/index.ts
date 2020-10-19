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

class DbHelper {
  addTranslationRecord(lookUpResult: any) {
    const oldTranslationRecords: any[] =
      sharedDb.data?.translationRecords.filter(
        (v) => v.word !== lookUpResult.word
      ) || [];
    const newTranslationRecords = [lookUpResult, ...oldTranslationRecords];

    while ((sharedDb.data?.translationRecords?.length || 0) > 0) {
      sharedDb.data?.translationRecords.pop();
    }

    sharedDb.data?.translationRecords.push(...newTranslationRecords);
    sharedDb.write();
  }
}

const sharedDbHelper = new DbHelper();

export { sharedDb, sharedDbHelper };
