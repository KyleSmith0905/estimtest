import { EstimtestExperiments, EstimtestWrapper } from '.';

const activateFontSize = (_wrapper: EstimtestWrapper, test: EstimtestExperiments) => {
	document.documentElement.dataset.beforeFontSize = document.documentElement.style.getPropertyValue('font-size');
	document.documentElement.style.setProperty('font-size', `${test.fontSize}px`);
};

export { activateFontSize };