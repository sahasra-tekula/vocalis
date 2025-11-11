// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v2', // This is the "path" we will call
    createProxyMiddleware({
      target: 'https://api.speechsuper.com', // The real API server
      changeOrigin: true,
      pathRewrite: {
        '^/api/v2': '/api/v2', // Keep the path the same
      },
    })
  );
};