// import * as React from "react";
// import * as ReactDOM from "react-dom";

import { sharedApiClient } from './networking';
import UserConfig from './utils/user-config';

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // onMessage must return "true" if response is async.
  let isResponseAsync = false;

  const _handleMessageRequest = () => {
    const successCallback = (response: any) => sendResponse({ response });
    const failureCallback = (error: any) => sendResponse({ error });

    sharedApiClient
      .request(request.arguments, false)
      .then(successCallback)
      .catch(failureCallback);

    return true;
  };

  const _handleMessageOpenOptionsPage = () => {
    chrome.runtime.openOptionsPage();
    return true;
  };

  const _handleMessagePlayAudio = () => {
    const { url } = request.arguments;

    const audio = new Audio(url);
    audio.play();

    return true;
  };

  const _handleMessageAccountLogin = () => {
    UserConfig.save(request.arguments, () => {});
    return true;
  };

  const _handleMessageAccountLogout = () => {
    UserConfig.save({
      accessToken: null,
      currentUser: null,
    }, () => {});
    return true;
  };

  switch (request.method) {
    case 'request':
      return _handleMessageRequest();
    case 'openOptionsPage':
      return _handleMessageOpenOptionsPage();
    case 'playAudio':
      return _handleMessagePlayAudio();
    case 'accountLogin':
      return _handleMessageAccountLogin();
    case 'accountLogout':
      return _handleMessageAccountLogout();
    default:
      console.log(`Message not supported.`);
  }

  return isResponseAsync;
});
