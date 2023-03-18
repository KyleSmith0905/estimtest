import express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { logInfo } from './lib/console';
import { splice } from './lib/string';
import chalk from 'chalk';
import { getConfigFile } from './config';
import { objectToAttributes } from './lib/dom';

const startProxyServer = () => {
  const app = express()
  const port = 3571;

  const apiProxy = createProxyMiddleware({
    target: 'http://localhost:5173/',
    selfHandleResponse: true,
    logLevel: 'silent',
    onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, _req, _res) => {
      let body: string = responseBuffer.toString('utf8');
      if (body.startsWith('<!DOCTYPE html>')) {
        const config = await getConfigFile();
        
        const bodyIndex = body.indexOf('</body');
        body = splice(body, `
          <estimtest-core 
            style="width: 100%; position: absolute;"
            ${config && objectToAttributes(config)}
          ></estimtest-core>
        `, bodyIndex);
  
        const headIndex = body.indexOf('</head');
        body = splice(body, `
          <script type="module">
            import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/estimtest-core/loader/index.es2017.js';
            defineCustomElements();
          </script>
        `, headIndex);
    
        return body;
      }
      else {
        return body;
      }
    }),
  });
  
  app.use('*', apiProxy);
  
  app.listen(port, () => {
    logInfo(`Experiment Your Website With Estimtest At ${chalk.underline.cyan(`http://localhost:${port}`)}`)
  })
}

export { startProxyServer };