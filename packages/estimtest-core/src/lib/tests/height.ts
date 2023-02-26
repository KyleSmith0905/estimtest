import { EstimtestTest } from ".";
import { EstimtestConfig } from "../config"

const resetHeight = (config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.removeProperty('min-height');
  container.style.removeProperty('max-height');
}

const activateHeight = (test: EstimtestTest, config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.setProperty('min-height', `${test.height}px`);
  container.style.setProperty('max-height', `${test.height}px`);
}

export { resetHeight, activateHeight };