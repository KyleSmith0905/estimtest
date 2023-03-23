#!/usr/bin/env node

import { logInfo } from "./lib/console.js";
import { startProxyServer } from "./server.js";

const start = () => {
  logInfo('Starting Estimtest Proxy Server');

  startProxyServer();
}

const commandLineInitializer = () => {
  const command = process.argv[2];

  if (command === 'start') {
    start();
  }
}


commandLineInitializer();