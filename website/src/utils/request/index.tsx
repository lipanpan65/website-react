import { message } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 获取 baseURL
const getBaseUrl = (): string => {
  return process.env.APP_BASE_API || '/';
};

// 错误状态处理
const httpStatusHandler = (error: any) => {
  const { response } = error;
  let responseMessage = '异常问题，请联系管理员！';

  if (response) {
    const statusMessages: Record<number, string> = {
      302: '接口重定向了！',
      400: '参数不正确！',
      401: '您未登录，或者登录已经超时，请先登录！',
      403: '您没有权限操作！',
      404: `请求地址出错: ${response.config.url}`,
      408: '请求超时！',
      409: '系统已存在相同数据！',
      500: '服务器内部错误！',
      501: '服务未实现！',
      502: '网关错误！',
      503: '服务不可用！',
      504: '服务暂时无法访问，请稍后再试！',
      505: 'HTTP版本不受支持！',
    };
    responseMessage = statusMessages[response.status] || responseMessage;

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/';
    }
  } else if (error.message.includes('timeout')) {
    responseMessage = '网络请求超时！';
  } else if (error.message.includes('Network')) {
    responseMessage = window.navigator.onLine ? '服务端异常！' : '您断网了！';
  }

  message.error(responseMessage);
  return Promise.reject(error);
};

// 请求方法
export const request = async <T = any>(cfg: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 50000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => config,
    (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('请求拦截异常信息', error);
      }
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<any>): AxiosResponse<any> | Promise<AxiosResponse<any>> => {
      console.log("interceptors", response);
      console.log("interceptors.data", response.data);
      const { status, statusText } = response;
      const contentType = response.headers['content-type'];

      // 处理 JSON 响应
      if (contentType && contentType.includes('application/json')) {
        const { code, message: responseMessage, data } = response.data;
        // debugger // TODO 再次进行详细的优化
        // 如果状态码为 200 且 statusText 为 'OK'，处理 code 字段
        if (status === 200 && statusText.toUpperCase() === 'OK') {
          switch (code) {
            case '0000': // SUCCESS
              return response.data; // 操作成功，返回 data

            case '4000': // VALIDATE
              message.error(responseMessage || '参数异常，请检查输入！');
              return Promise.reject(response.data); // 拒绝并返回完整的响应

            case '5000': // EXCEPTION
              message.error(responseMessage || '业务逻辑异常，请稍后再试！');
              return Promise.reject(response.data); // 拒绝并返回完整的响应

            case '9999': // FAILURE
              message.error(responseMessage || '操作失败，请联系管理员！');
              return Promise.reject(response.data); // 拒绝并返回完整的响应

            default:
              message.error('未知错误，请联系管理员！');
              return Promise.reject(response.data); // 拒绝并返回完整的响应
          }
        }
      }

      return response; // 返回完整的响应对象
    },
    (error) => httpStatusHandler(error)
  );


  // 发起请求
  try {
    const response: AxiosResponse<T> = await instance(cfg);

    if (process.env.NODE_ENV === 'development') {
      console.log('response.node-env', response);
    }

    return response as T; // 返回已解析的数据
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('网络请求异常', error);
    }
    throw error;
  }
};
