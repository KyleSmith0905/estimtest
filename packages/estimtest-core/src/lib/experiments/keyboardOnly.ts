import { EstimtestTest, EstimtestWrapper } from '.';

const activateKeyboardOnly = (wrapper: EstimtestWrapper, _: EstimtestTest) => {
	wrapper.content.style.setProperty('pointer-events', 'none');
};

export { activateKeyboardOnly };