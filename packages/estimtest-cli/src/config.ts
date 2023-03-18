import { EstimtestExperiments, EstimtestAttributes } from 'estimtest-core';
import { findUp } from 'find-up';

interface EstimtestConfig extends EstimtestAttributes {
	experiments: EstimtestExperiments[];
	moveSelector?: string;
  estimtestPort?: number,
  copyPort: number,
}

const defaultConfig = defaultEstimtestAttributes

const getConfigFile = async (): Promise<Partial<EstimtestConfig> | undefined> => {
  const configPath = await findUp('estimtest.config.js');

  if (!configPath) return undefined;

  const config = await import(`file://${configPath}`)
  
  return config.default;
}

export { getConfigFile };