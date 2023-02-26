import { EstimtestConfig } from "../config";
import { activateFontSize, resetFontSize } from "./fontSize";
import { activateHeight } from "./height";
import { activateWidth } from "./width";

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

const performTest = (test: EstimtestTest, config: EstimtestConfig) => {
  resetFontSize(config);
  
  if (test.fontSize) activateFontSize(test, config);
  if (test.width) activateWidth(test, config);
  if (test.height) activateHeight(test, config);
}

export type { EstimtestTest };
export { performTest };