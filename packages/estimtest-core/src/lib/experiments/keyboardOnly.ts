import { EstimtestExperiments, EstimtestWrapper } from '.';

const activateKeyboardOnly = (wrapper: EstimtestWrapper, _: EstimtestExperiments) => {
	wrapper.content.style.setProperty('pointer-events', 'none');
};

export { activateKeyboardOnly };