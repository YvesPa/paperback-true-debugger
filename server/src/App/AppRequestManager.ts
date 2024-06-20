import { 
  Request, 
  Response, 
  RequestManager, 
  SourceCookieStore, 
  SourceInterceptor 
} from "@paperback/types";

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export class AppRequestManager implements RequestManager {
  readonly cookieStore?: SourceCookieStore;
  readonly interceptor?: SourceInterceptor;
  readonly requestsPerSecond: number;
  readonly requestTimeout: number;

  private _defaultUserAgent = '';
  setDefaultUserAgent(userAgent: string) { this._defaultUserAgent = userAgent; }
  async getDefaultUserAgent() { return this._defaultUserAgent };

  async schedule(request: Request, retry: number): Promise<Response> {

    if (this.interceptor) {
      request = await this.interceptor.interceptRequest(request);
    }

    const { url, method, headers, data, param } = request;

    const cookies = [...(this.cookieStore?.getAllCookies() ?? []), ...(request.cookies ?? [])];
    if (cookies.length > 0)
      headers.cookie = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');

    const requestConfig: AxiosRequestConfig = {
      url: param ? `${url}/${param}` : url,
      method: method,
      headers: headers,
      data: data,
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: this.requestTimeout,
      responseType: "arraybuffer"
    };

    let response : Response;
    try {
      const httpResponse = await axios.request(requestConfig);

      response = {
        data: httpResponse.data as string,
        rawData: httpResponse.data,
        status: httpResponse.status,
        headers: httpResponse.headers,
        request: request
      };
  
      if (this.interceptor) {
        response = await this.interceptor.interceptResponse(response);
      }
  
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        response = {
          data: 'error',
          status: 500,
          headers: {},
          request: request
        };
      } else {
        throw error;
      }
    }

    return response;
  }

  constructor(
    info:{
      interceptor?: SourceInterceptor,
      requestsPerSecond?: number,
      requestTimeout?: number,
    },
    cookieStore?: SourceCookieStore)
  {
    this.interceptor = info.interceptor;
    this.requestsPerSecond = 10;
    this.requestTimeout = 4000;
    this.cookieStore = cookieStore;
  }

}
