import { EstimtestTest } from '.';

const activateWidth = (element: HTMLElement, test: EstimtestTest) => {
	element.style.setProperty('min-width', `${test.width}px`);
	element.style.setProperty('max-width', `${test.width}px`);
	element.style.setProperty('overflow', 'scroll');
	element.style.setProperty('box-shadow', '0rem 0rem 8rem 0rem hsl(0deg, 0%, 5%), 0rem 0rem 0rem max(100vw, 100vh) hsl(0deg, 0%, 10%)');
	element.style.setProperty('position', 'relative');
	element.style.setProperty('margin', 'auto');
};

export { activateWidth };