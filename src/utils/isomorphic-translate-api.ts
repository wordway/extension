import { Method } from 'axios';
import { TranslateOverrides } from '@wordway/translate-api';

import { sharedApiClient } from '../networking';

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
