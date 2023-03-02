import { EstimtestTest, EstimtestWrapper } from '.';

const activateFontSize = (wrapper: EstimtestWrapper, test: EstimtestTest) => {
	wrapper.content.style.setProperty('font-size', `${test.fontSize}px`);
};

export { activateFontSize };