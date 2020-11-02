// import * as React from "react";
// import * as ReactDOM from "react-dom";

import { sharedHttpClient } from './networking';
import { sharedConfigManager } from './utils/config';

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // onMessage must return "true" if response is async.
  let isResponseAsync = false;

  const _handleMessageRequest = () => {
    const successCallback = (response: any) => sendResponse({ response });
    const failureCallback = (error: any) => sendResponse({ error });

    sharedHttpClient
      .request(request.arguments, false)
      .then(successCallback)
      .catch(failureCallback);

    return true;
  };

  const _handleMessageRequestBase64Image = () => {
    const successCallback = (base64Image: any) => sendResponse({ base64Image });
    const failureCallback = (error: any) => sendResponse({ error });

    const { src } = request.arguments;

    fetch(src || '')
      .then((response) => response.blob())
      .then((blob) => {
        var reader = new FileReader();
        reader.onload = function () {
          successCallback(this.result);
          console.log(this.result);
        }; // <--- `this.result` contains a base64 data URI
        reader.readAsDataURL(blob);
      });

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
    const { loggedInUser } = request.arguments;
    sharedConfigManager.setLoggedInUser(loggedInUser);
    return true;
  };

  const _handleMessageAccountLogout = () => {
    sharedConfigManager.setLoggedInUser(null);
    return true;
  };

  switch (request.method) {
    case 'request':
      return _handleMessageRequest();
    case 'requestBase64Image':
      return _handleMessageRequestBase64Image();
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
