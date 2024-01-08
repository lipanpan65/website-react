import Mock from 'mockjs'
// import userMock from './user'
import postsMock from './posts'
// import orgMock from './organization'
// import chartsMock from './charts'
// import modelsMock from './models'
// import devMock from './dev'

// const Mock = require('mockjs')
// http://mockjs.com/examples.html
// 全局配置 模拟请求延迟时间
Mock.setup({ timeout: '100-200' })

const mockRoutes = [
  // ...userMock.mockRoutes,
  ...postsMock.mockRoutes,
  // ...orgMock.mockRoutes,
  // ...chartsMock.mockRoutes,
  // ...modelsMock.mockRoutes,
  // ...devMock.mockRoutes
]
// 渲染路由
mockRoutes.forEach(route => {
  Mock.mock(route.url, route.method === undefined ? 'get' : route.method, route.tpl)
})

export {
  // userMock,
  postsMock,
  // orgMock,
  // chartsMock,
  // modelsMock,
  // devMock
}
