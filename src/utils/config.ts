import localforage from './localforage';

const DEFAULT_TRANSLATE_ENGINE = 'youdao-web';

export class Config {
  public loggedInUser: any;
  public translateEngine: string = DEFAULT_TRANSLATE_ENGINE;
  public autoplayPronunciation: string = 'us-pronunciation';
  public selectionTranslateMode: string = 'enable-translate-popover';
  public selectionTranslateShortcutKey: string = 'shift+s';
}

export interface ConfigListener {
  onConfigChange(newConfig: Config): any;
}

export default class ConfigManager {
  static _instance: ConfigManager;
  static getInstance(): ConfigManager {
    if (!this._instance) {
      this._instance = new ConfigManager();
    }
    return this._instance;
  }

  constructor() {
    if (chrome.extension) {
      chrome.storage.onChanged.addListener(async (changes, _) => {
        await this.load();
        this.listeners.forEach((l) => l.onConfigChange(this.config));
      });
    }
  }

  public config: Config = new Config();

  private listeners: Array<ConfigListener> = [];

  addListener(listener: ConfigListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: ConfigListener) {
    const index = this.listeners.indexOf(listener, 0);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  async getConfig() {
    await this.load();

    return this.config;
  }

  async setLoggedInUser(user: any) {
    this.config.loggedInUser =
      typeof user === 'string' ? JSON.parse(user) : user;
    await this.save();
  }

  async setTranslateEngine(translateEngine: any) {
    this.config.translateEngine = translateEngine;
    await this.save();
  }

  async setAutoplayPronunciation(autoplayPronunciation: any) {
    this.config.autoplayPronunciation = autoplayPronunciation;
    await this.save();
  }

  async setSelectionTranslateMode(selectionTranslateMode: any) {
    this.config.selectionTranslateMode = selectionTranslateMode;
    await this.save();
  }

  async setSelectionTranslateShortcutKey(selectionTranslateShortcutKey: any) {
    this.config.selectionTranslateShortcutKey = selectionTranslateShortcutKey;
    await this.save();
  }

  async load() {
    let jsonString: string = (await localforage.getItem('_config')) as string;
    this.config = Object.assign(this.config, JSON.parse(jsonString));
  }

  async save() {
    await localforage.setItem('_config', JSON.stringify(this.config));
    this.listeners.forEach((l) => l.onConfigChange(this.config));
  }
}

export const sharedConfigManager = ConfigManager.getInstance();
