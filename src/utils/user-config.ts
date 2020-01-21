class UserConfig {
  public accessToken: any;
  public currentUser: any;
  public selectionTranslateMode: string = "enable-translate-tooltip";
  public selectionTranslateEngine: string = "youdao-web";
  public autoplayPronunciation: string = "us-pronunciation";

  public static load(callback: any) {
    const keys = [
      "accessToken",
      "currentUser",
      "selectionTranslateMode",
      "selectionTranslateEngine",
      "autoplayPronunciation",
    ];
    chrome.storage.sync.get(keys, (result: any) => {
      const { currentUser, ...rest } = result;
      callback({
        currentUser: currentUser ? JSON.parse(currentUser) : null,
        ...rest
      });
    });
  }

  public static save(config: any, callback: any) {
    let nextConfig = config;
    if (config.currentUser) {
      const currentUser = typeof config.currentUser !== 'string' ? JSON.stringify(config.currentUser) : config.currentUser;
      nextConfig = Object.assign(config, { currentUser })
    }

    chrome.storage.sync.set(nextConfig, () => {
      UserConfig.load(callback);
    });
  }
}

export default UserConfig;
