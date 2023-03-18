import { logInfo } from "./lib/console";
import { startProxyServer } from "./server";

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