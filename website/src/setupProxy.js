
require('dotenv').config({ path: '.env' })
const { createProxyMiddleware } = require('http-proxy-middleware');
// 使用
console.log(process.env.HOST) // localhost
console.log(process.env.PORT) // 3000
console.log(process.env.MONGOOSE_URL) // mongodb://localhost:27017/test

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:1337', //代理的地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''  // 将请求路径中的 "/api" 替换为 ""
      }
    })
  )
};