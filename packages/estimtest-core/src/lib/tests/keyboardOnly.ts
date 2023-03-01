import { EstimtestTest } from '.';

const activateKeyboardOnly = (element: HTMLElement, _: EstimtestTest) => {
	element.style.setProperty('pointer-events', 'none');
};

export { activateKeyboardOnly };