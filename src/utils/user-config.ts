import { sharedTranslate } from '../networking';

const DEFAULT_TRANSLATE_ENGINE = 'youdao-web';

class UserConfig {
  public accessToken: any;
  public currentUser: any;
  public selectionTranslateMode: string = 'enable-translate-tooltip';
  public selectionTranslateScopes: Array<string> = sharedTranslate.engine(
    DEFAULT_TRANSLATE_ENGINE
  ).scopes;
  public translateEngine: string = DEFAULT_TRANSLATE_ENGINE;
  public autoplayPronunciation: string = 'us-pronunciation';

  public static load(callback: any) {
    const keys = [
      'accessToken',
      'currentUser',
      'selectionTranslateMode',
      'selectionTranslateScopes',
      'translateEngine',
      'autoplayPronunciation'
    ];
    chrome.storage.sync.get(keys, (result: any) => {
      const { currentUser, selectionTranslateScopes, ...rest } = result;
      callback(
        Object.assign(new UserConfig(), {
          ...(currentUser ? { currentUser: JSON.parse(currentUser) } : {}),
          ...(selectionTranslateScopes
            ? { selectionTranslateScopes: JSON.parse(selectionTranslateScopes) }
            : {}),
          ...rest
        })
      );
    });
  }

  public static save(config: any, callback: any) {
    let nextConfig = config;
    if (config.currentUser) {
      const currentUser =
        typeof config.currentUser !== 'string'
          ? JSON.stringify(config.currentUser)
          : config.currentUser;
      nextConfig = Object.assign(config, { currentUser });
    }
    if (config.selectionTranslateScopes) {
      const selectionTranslateScopes =
        typeof config.selectionTranslateScopes !== 'string'
          ? JSON.stringify(config.selectionTranslateScopes)
          : config.selectionTranslateScopes;
      nextConfig = Object.assign(config, { selectionTranslateScopes });
    }

    chrome.storage.sync.set(nextConfig, () => {
      UserConfig.load(callback);
    });
  }
}

export default UserConfig;
