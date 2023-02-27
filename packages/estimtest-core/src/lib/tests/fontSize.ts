import { EstimtestTest } from ".";
import { EstimtestConfig } from "../config"

const activateFontSize = (test: EstimtestTest, config: EstimtestConfig) => {
  const container = document.querySelector<HTMLElement>(config.selectors.container);
  container.style.setProperty('font-size', `${test.fontSize}px`);
}

export { activateFontSize };