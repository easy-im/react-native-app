import AsyncStorage from '@react-native-async-storage/async-storage';
import { CURRENT_USER_KEY } from '@/constant';
import config from '../config';

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

const TIMEOUT = 60000;

const request = async (url: string, options: RequestInit) => {
  const userStr = await AsyncStorage.getItem(CURRENT_USER_KEY);
  const user = userStr ? JSON.parse(userStr) : null;
  const token = user ? user.token : null;

  const finalUrl = /^https?:\/\//.test(url) ? url : `${config.baseUrl}${url}`;
  const headers = {
    'content-type': 'application/json',
    'x-access-token': token,
    ...(options.headers || {}),
  };

  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  const signal = controller.signal;

  const timeout = (time: number): Promise<Response> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        resolve(new Response('timeout', { status: 504, statusText: 'network timeout' }));
        controller.abort();
      }, time);
    });
  };

  const func = fetch(finalUrl, {
    headers,
    signal,
    mode: 'cors',
    ...options,
  });
  return Promise.race([func, timeout(TIMEOUT)])
    .then((res: Response) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(JSON.stringify({ status: res.status, error: res.statusText || 'network error' }));
    })
    .catch((error) => {
      console.log('request error:', error);
    });
};

request.get = (url: string, params?: any, options: RequestInit = {}) => {
  let final = url;
  if (params) {
    final += final.indexOf('?') === -1 ? '?' : '&';
    final += Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
  }
  return request(final, { method: 'GET', ...options });
};

request.post = (url: string, data: Record<string | number, any> = {}, options: RequestInit = {}) => {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

request.put = (url: string, data: Record<string | number, any> = {}, options: RequestInit = {}) => {
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

export default request;
