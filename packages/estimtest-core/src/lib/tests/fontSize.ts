import { EstimtestTest } from ".";
import { EstimtestConfig } from "../config"

const resetFontSize = (config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.removeProperty('font-size');
}

const activateFontSize = (test: EstimtestTest, config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.setProperty('font-size', `${test.fontSize}px`);
}

export { resetFontSize, activateFontSize };