import { EstimtestTest } from ".";
import { EstimtestConfig } from "../config"

const resetWidth = (config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.removeProperty('width');
}

const activateWidth = (test: EstimtestTest, config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.setProperty('width', `${test.width}px`);
}

export { resetWidth, activateWidth };