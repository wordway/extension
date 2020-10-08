import localforage from 'localforage';
import syncDriver from 'localforage-webextensionstorage-driver/sync';

localforage.setDriver(localforage.LOCALSTORAGE);

if (chrome.extension) {
  localforage
    .defineDriver(syncDriver)
    .then(() => localforage.setDriver('webExtensionSyncStorage'));
}

declare var window: any;
window.localforage = localforage;

export default localforage;
