import { defaultEstimtestAttributes, EstimtestConfig } from 'estimtest-utils/config';
import { findUp } from 'find-up';

const defaultEstimtestConfiguration: EstimtestConfig = {
  ...defaultEstimtestAttributes,
  webPort: 3000,
  estimtestPort: 3571,
}

/**
 * Retrieves the configuration file and fills in anything undefined with a default configuration.
 */
const getConfigFileDefined = async (): Promise<EstimtestConfig> => {
  const configFile = await getConfigFile()
  
  if (configFile) {
    return {
      ...defaultEstimtestConfiguration,
      ...configFile
    };
  }
  else {
    return defaultEstimtestConfiguration
  }
}

/**
 * Retrieves the configuration file as is and does not handle undefined values.
 */
const getConfigFile = async (): Promise<Partial<EstimtestConfig> | undefined> => {
  const configPath = await findUp('estimtest.config.js');

  if (!configPath) return undefined;

  const config = await import(`file://${configPath}`)
  
  return config.default;
}

export { getConfigFile, getConfigFileDefined };