// import * as dva from 'dva'
import { fetch } from 'dva';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import hash from 'hash.js';
import { setFormData, setUrlEncoded } from './baseServer';
// import axios from 'axios'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  Toast.offline(`请求错误 ${response.status}: ${response.url},${errortext}`);
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "dva.fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: true,
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (newOptions.formString) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.formString);
    } else if (newOptions.formdata) {
      newOptions.headers = {
        Accept: 'application/json',
        'enctype': 'multipart/form-data',
        ...newOptions.headers,
      };
      newOptions.body = setFormData(newOptions.formdata);
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers,
      };
      if (newOptions.body) {
        newOptions.body = setUrlEncoded(newOptions.body);
      }
    }
    // }
  } else if (newOptions.method === 'GET') {
    if (newOptions.type === 'urlencoded') {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers,
      };
      newOptions.body = setUrlEncoded(newOptions.body);
    } else {
      url = url + '?' + setUrlEncoded(newOptions.body)
      delete newOptions.body
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    // .then(response => cachedSave(response, hashcode))
    .then((response) => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();

    })
    .catch((e) => {
      const status = e.name;
        debugger
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        // window.g_app._store.dispatch({
        //   type: 'login/logout',
        // });
        return;
      }
      // environment should not be used
      if (status === 403) {
        // router.push('/Exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        // router.push('/Exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        // router.push('/404');
      }
    }).then(result=>{
      if(result.code==999){
        Toast.info('非常抱歉,系统发生错误',2);
      }
      return result;
    });
}
