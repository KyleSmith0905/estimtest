import { EstimtestExperiments, EstimtestWrapper } from '.';

const activateFontSize = (wrapper: EstimtestWrapper, test: EstimtestExperiments) => {
	const fontSizeBefore = getComputedStyle(document.documentElement).getPropertyValue('font-size');
	// Ensure that the estimtest components are not effected by the font size changes.
	wrapper.host.style.setProperty('font-size', fontSizeBefore);

	// Save the font size style property for when it resets.
	document.documentElement.dataset.beforeFontSize = fontSizeBefore;

	// Change the font size of the root element.
	document.documentElement.style.setProperty('font-size', `${test.fontSize}px`);

};

export { activateFontSize };