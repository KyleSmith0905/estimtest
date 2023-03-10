import { EstimtestExperiments, EstimtestWrapper } from '.';

const activateFontSize = (wrapper: EstimtestWrapper, test: EstimtestExperiments) => {
	wrapper.content.style.setProperty('font-size', `${test.fontSize}px`);
};

export { activateFontSize };