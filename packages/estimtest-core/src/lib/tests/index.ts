import { EstimtestConfig } from "../config";
import { activateFontSize } from "./fontSize";
import { activateHeight } from "./height";
import { activateWidth } from "./width";

interface EstimtestTest {
  name: string,
  index: number,
  description: string,
  results?: 'pass' | 'fail',
  notes?: string,
  // Test options
  fontSize?: number,
  width?: number,
  height?: number,
}

const resetTest = (config: EstimtestConfig) => {
  const element = document.querySelector<HTMLElement>(config.selectors.container);
  element.removeAttribute('style');
}

const performTest = (test: EstimtestTest, config: EstimtestConfig) => {
  resetTest(config);
  
  if (test.fontSize !== undefined) activateFontSize(test, config);
  if (test.width !== undefined) activateWidth(test, config);
  if (test.height !== undefined) activateHeight(test, config);
}

export type { EstimtestTest };
export { resetTest, performTest };