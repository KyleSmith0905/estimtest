import { EstimtestTest } from ".";
import { EstimtestConfig } from "../config"

const resetWidth = (config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.removeProperty('min-width');
  container.style.removeProperty('max-width');
}

const activateWidth = (test: EstimtestTest, config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.setProperty('min-width', `${test.width}px`);
  container.style.setProperty('max-width', `${test.width}px`);
}

export { resetWidth, activateWidth };