import { EstimtestTest } from '.';

const activateHeight = (element: HTMLElement, test: EstimtestTest) => {
	element.style.setProperty('min-height', `${test.height}px`);
	element.style.setProperty('max-height', `${test.height}px`);
	element.style.setProperty('overflow', 'scroll');
	element.style.setProperty('box-shadow', '0rem 0rem 8rem 0rem hsl(0deg, 0%, 5%), 0rem 0rem 0rem max(100vw, 100vh) hsl(0deg, 0%, 10%)');
	element.style.setProperty('position', 'relative');
	element.style.setProperty('margin', 'auto');
};

export { activateHeight };