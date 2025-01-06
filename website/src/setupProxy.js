
require('dotenv').config({ path: '.env' })
const { createProxyMiddleware } = require('http-proxy-middleware');
// 使用
console.log(process.env.HOST) // localhost
console.log(process.env.PORT) // 3000
console.log(process.env.MONGOOSE_URL) // mongodb://localhost:27017/test

module.exports = function (app) {
  // app.use(
  //   '/api',
  //   createProxyMiddleware({
  //     // target: 'http://localhost:1337', //代理的地址
  //     target: 'http://127.0.0.1:9000', //代理的地址
  //     changeOrigin: true,
  //     // pathRewrite: {
  //     //   '^/api': ''  // 将请求路径中的 "/api" 替换为 ""
  //     // }
  //   })
  // )

  // 处理 /api/v1 的请求
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://127.0.0.1:9001', // 代理的地址
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1': '/api/v1',  // 保持请求路径中的 "/api/v1"
      }
    })
  );

  // 处理 /api 的请求
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:9000', // 另一个代理的地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',  // 保持请求路径中的 "/api"
      }
    })
  );
};