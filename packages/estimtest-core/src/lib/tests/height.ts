import { EstimtestTest } from '.';
import { EstimtestConfig } from '../config';

const activateHeight = (test: EstimtestTest, config: EstimtestConfig) => {
	const container = document.querySelector<HTMLElement>(config.selectors.container);
	container.style.setProperty('min-height', `${test.height}px`);
	container.style.setProperty('max-height', `${test.height}px`);
	container.style.setProperty('overflow', 'scroll');
	container.style.setProperty('box-shadow', '0rem 0rem 8rem 0rem hsl(0deg, 0%, 5%), 0rem 0rem 0rem max(50vw, 50vh) hsl(0deg, 0%, 10%)');
};

export { activateHeight };