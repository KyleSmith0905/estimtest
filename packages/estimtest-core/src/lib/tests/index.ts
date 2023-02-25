import { EstimtestConfig } from "../config";
import { activateFontSize, resetFontSize } from "./fontSize";

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
}

export type { EstimtestTest };
export { performTest };