import { EstimtestConfig } from "../config";
import { activateFontSize, resetFontSize } from "./fontSize";
import { activateHeight, resetHeight } from "./height";
import { activateWidth, resetWidth } from "./width";

interface EstimtestTest {
  name: string,
  index: number,
  description: string,
  results?: 'pass' | 'fail',
  notes?: string,
  fontSize?: number,
  width?: number,
  height?: number,
}

const resetTest = (config: EstimtestConfig) => {
  resetFontSize(config);
  resetWidth(config);
  resetHeight(config);
}

const performTest = (test: EstimtestTest, config: EstimtestConfig) => {
  resetTest(config);
  
  if (test.fontSize !== undefined) activateFontSize(test, config);
  if (test.width !== undefined) activateWidth(test, config);
  if (test.height !== undefined) activateHeight(test, config);
}

export type { EstimtestTest };
export { resetTest, performTest };