import express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { logInfo } from './lib/console.js';
import { splice } from './lib/string.js';
import chalk from 'chalk';
import { getConfigFile, getConfigFileDefined } from './config.js';
import { objectToAttributes } from './lib/dom.js';

const startProxyServer = async () => {
  const startConfig = await getConfigFileDefined();

  const app = express()
  const port = startConfig.estimtestPort;

  const apiProxy = createProxyMiddleware({
    target: `http://localhost:${startConfig.webPort}/`,
    selfHandleResponse: true,
    
    logLevel: 'silent',
    onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, _req, _res) => {
      let body: string = responseBuffer.toString('utf8');

      /**
       * Add estimtest components into the html.
       */
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
        return responseBuffer;
      }
    }),
  });
  
  app.use('*', apiProxy);
  
  app.listen(port, () => {
    logInfo(`Experiment Your Website With Estimtest At ${chalk.underline.cyan(`http://localhost:${port}`)}`)
  })
}

export { startProxyServer };