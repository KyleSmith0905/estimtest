import { EstimtestConfig } from 'estimtest-utils/config';
import { findUp } from 'find-up';

const getConfigFile = async (): Promise<Partial<EstimtestConfig> | undefined> => {
  const configPath = await findUp('estimtest.config.js');

  if (!configPath) return undefined;

  const config = await import(`file://${configPath}`)
  
  return config.default;
}

export { getConfigFile };