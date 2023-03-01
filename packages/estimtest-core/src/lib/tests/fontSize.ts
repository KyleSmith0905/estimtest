import { EstimtestTest } from '.';

const activateFontSize = (element: HTMLElement, test: EstimtestTest) => {
	element.style.setProperty('font-size', `${test.fontSize}px`);
};

export { activateFontSize };