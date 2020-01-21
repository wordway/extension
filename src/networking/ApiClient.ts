import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import env from '../utils/env';
import normalize from '../utils/normalize';
import UserConfig from '../utils/user-config';

class ApiClient {
  private sharedAxios: AxiosInstance;

  private accessToken: string = '';

  public constructor() {
    this.sharedAxios = axios.create({
      baseURL: env.apiURL
    });

    this.sharedAxios.interceptors.request.use(
      async (config): Promise<AxiosRequestConfig> => {
        const baseURL = config.baseURL?.toString() ?? '';
        let nextConfig = config;

        if (baseURL.startsWith(env.apiURL || '')) {
          nextConfig = Object.assign({}, config, {
            data: normalize('snakecase', config.data)
          });

          if (this.accessToken) {
            nextConfig.headers.Authorization = `Bearer ${this.accessToken}`;
          }
        }
        return nextConfig;
      }
    );
    this.sharedAxios.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        const url = response.request.url?.toString() ?? '';
        let nextResponse = response;
        if (url.startsWith(env.apiURL)) {
          nextResponse = Object.assign({}, response, {
            data: normalize('camelcase', response.data)
          });
        }
        return nextResponse;
      },
      (error): any => {
        const { response: { data } = { data: undefined } } = error;
        if (data) {
          if (data.errors && data.errors.length > 0) {
            error.message = data.errors[0].message;
          } else if (data.message) {
            error.message = data.message;
          }
        }
        return Promise.reject(error);
      }
    );

    UserConfig.load((userConfig: UserConfig) => {
      this.accessToken = userConfig.accessToken;
    })
    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (const key in changes) {
        if (key === 'accessToken') {
          const storageChange = changes[key];

          this.accessToken = storageChange.newValue;
        }
      }
    });
  }

  public request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
    runInBackground = true
  ): Promise<R> {
    if (!runInBackground) {
      return this.sharedAxios.request(config);
    }

    return new Promise<R>((resolve, reject) => {
      const message = { method: 'request', arguments: config };
      const responseCallback = ({ response, error }: any) => {
        if (response) resolve(response);
        if (error) reject(error);
      };
      chrome.runtime.sendMessage(message, responseCallback);
    });
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.request({
      method: 'GET',
      url,
      ...config
    });
  }

  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request({
      method: 'DELETE',
      url,
      ...config
    });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.request({
      method: 'POST',
      url,
      data,
      ...config
    });
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.request({
      method: 'PUT',
      url,
      data,
      ...config
    });
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.request({
      method: 'PATCH',
      url,
      data,
      ...config
    });
  }
}

export default ApiClient;
