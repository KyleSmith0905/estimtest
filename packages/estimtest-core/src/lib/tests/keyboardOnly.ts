import { EstimtestTest } from '.';
import { EstimtestConfig } from '../config';

const activateKeyboardOnly = (_: EstimtestTest, config: EstimtestConfig) => {
	const container = document.querySelector<HTMLElement>(config.selectors.container);
	container.style.setProperty('pointer-events', 'none');
};

export { activateKeyboardOnly };