import originAxios from 'axios'
// import {
//   getCookie,
//   // clearCookie
// } from '@/utils'
import { message } from 'antd'

const httpStatesHandler = ((error: any) => {
  let response_message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 302: response_message = '接口重定向了！'; break;
      case 400: response_message = '参数不正确！'; break;
      case 401:
        response_message = '您未登录，或者登录已经超时，请先登录！';
        window.location.href = '/'
        // clearCookie()
        break;
      case 403: response_message = '您没有权限操作！';
        window.location.href = '/'
        break
      case 404: response_message = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
      case 408: response_message = '请求超时！'; break;
      case 409: response_message = '系统已存在相同数据！'; break;
      case 500: response_message = '服务器内部错误！'; break;
      case 501: response_message = '服务未实现！'; break;
      case 502: response_message = '网关错误！'; break;
      case 503: response_message = '服务不可用！'; break;
      case 504: response_message = '服务暂时无法访问，请稍后再试！'; break;
      case 505: response_message = 'HTTP版本不受支持！'; break;
      default: response_message = '异常问题，请联系管理员！'; break
    }
  }
  if (error.message.includes('timeout')) response_message = '网络请求超时！';
  if (error.message.includes('Network')) response_message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
  message.error(response_message)
})

const request = (cfg: any, options?: any) => {

  return new Promise((resolve, reject) => {
    // 创建实例
    const instance = originAxios.create({
      baseURL: '/', // 设置统一的请求前缀
      timeout: 50000,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    })

    // 请求拦截
    instance.interceptors.request.use((config: any) => {
      //   const username = getCookie("username")
      //   const token = getCookie("token")
      //   if (username && token && typeof window != "undefined") {
      //     const token = getCookie("token")
      //     // 基于drf的原生认证
      //     config.headers.Authorization = `Token ${token}`
      //     // django csrf token
      //     config.headers["X-CSRFToken"] = getCookie("csrftoken")
      //   } else {
      //     // TODO 该位置进行路由跳转
      //   }
      return config
    }, (error: any) => {
      if (process.env.NODE_ENV === "development") console.log("请求拦截异常信息", error)
      return error
    })

    // 响应拦截
    instance.interceptors.response.use((response: any) => {
      return response
    }, (error: any) => {
      httpStatesHandler(error)
      // if (process.env.NODE_ENV === "development") console.log("响应拦截异常信息", error)
      return error
    })

    // 传入网络配置进行网络请求
    instance(cfg).then((response: any) => {
      // if (process.env.NODE_ENV === "development") console.log("response", response)
      resolve(response)
    }).catch((error: any) => {
      if (process.env.NODE_ENV === 'development') console.log('网络请求异常', error)
      reject(error)
    })
  })

}

export default request