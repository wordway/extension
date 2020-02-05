import { Method } from 'axios';
import Translate, {
  TranslateOverrides,
} from '@wordway/translate-api';
import CloudoptAIEngine from '@wordway/translate-engine-cloudoptai'
import BingWebEngine from '@wordway/translate-webengine-bing';
import YoudaoWebEngine from '@wordway/translate-webengine-youdao';

import { sharedApiClient } from '.';

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
        json: () => response.data,
        text: () => response.data
      });
    };
    const failureCallback = (error: any) => {
      reject(error);
    };

    const url = input.toString();
    const method: Method = (init?.method || 'GET') as Method;

    sharedApiClient
      .request({
        method,
        url
      })
      .then(successCallback)
      .catch(failureCallback);
  });
};

const cloudoptAIEngine = new CloudoptAIEngine();
const bingWebEngine = new BingWebEngine();
const youdaoWebEngine = new YoudaoWebEngine();

const sharedTranslate = new Translate([
  cloudoptAIEngine,
  bingWebEngine,
  youdaoWebEngine,
]);

export default sharedTranslate;
