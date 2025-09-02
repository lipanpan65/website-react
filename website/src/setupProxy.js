
require('dotenv').config({ path: '.env' })
const { createProxyMiddleware } = require('http-proxy-middleware');

// 在Docker容器中访问宿主机服务
// 使用 host.docker.internal (macOS/Windows) 或 host-gateway (Linux)
const getHostUrl = () => {
  // 检测是否在Docker容器中运行
  if (process.env.DOCKER_ENV === 'true') {
    // Docker容器中访问宿主机
    return 'http://host.docker.internal';
  }
  // 宿主机本地访问
  return 'http://127.0.0.1';
};

const hostUrl = getHostUrl();

console.log('🔗 代理配置:');
console.log('宿主机地址:', hostUrl);
console.log('Django后端:', `${hostUrl}:9798`);
console.log('Gin后端:', `${hostUrl}:9899`);

module.exports = function (app) {
  // 处理 /api/v1 的请求 (Gin后端)
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: `${hostUrl}:9899`,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1': '/api/v1',
      },
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('🚨 代理错误 (Gin):', err.message);
      }
    })
  );

  // 处理 /api 的请求 (Django后端)
  app.use(
    '/api',
    createProxyMiddleware({
      target: `${hostUrl}:9798`,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('🚨 代理错误 (Django):', err.message);
      }
    })
  );
};