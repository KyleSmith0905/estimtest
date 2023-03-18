import chalk from 'chalk';

const logInfo = (text: string) => {
  console.log(`${chalk.bold.magenta('[ Estimtest ]')} ${text}`)
}

export { logInfo };