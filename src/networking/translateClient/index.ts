import { Method } from 'axios';
import Translate, { TranslateOverrides } from '@wordway/translate-api';
import CloudoptAIEngine from '@wordway/translate-engine-cloudoptai';
import BingWebEngine from '@wordway/translate-webengine-bing';
import YoudaoWebEngine from '@wordway/translate-webengine-youdao';

import { sharedHttpClient } from '../httpClient';

const cloudoptAIEngine = new CloudoptAIEngine();
const bingWebEngine = new BingWebEngine();
const youdaoWebEngine = new YoudaoWebEngine();

const sharedTranslateClient: Translate | any = new Translate([
  cloudoptAIEngine,
  bingWebEngine,
  youdaoWebEngine,
]);

TranslateOverrides.fetch = (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  return new Promise<any>((resolve, reject) => {
    const successCallback = (response: any) => {
      resolve({
        headers: response.headers,
        ok: true,
        status: response.status,
        statusText: response.statusText,
        json: () =>
          typeof response.data === 'object'
            ? response.data
            : JSON.parse(response.data),
        text: () =>
          typeof response.data === 'object'
            ? JSON.stringify(response.data)
            : response.data,
      });
    };
    const failureCallback = (error: any) => {
      reject(error);
    };

    const url = input.toString();
    const method: Method = (init?.method || 'GET') as Method;

    sharedHttpClient
      .request({
        method,
        url,
      })
      .then(successCallback)
      .catch(failureCallback);
  });
};

export { sharedTranslateClient };
