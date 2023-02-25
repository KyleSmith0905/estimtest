import { EstimtestTest } from ".";
import { EstimtestConfig } from "../config"

const resetHeight = (config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.removeProperty('height');
}

const activateHeight = (test: EstimtestTest, config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.setProperty('height', `${test.height}px`);
}

export { resetHeight, activateHeight };