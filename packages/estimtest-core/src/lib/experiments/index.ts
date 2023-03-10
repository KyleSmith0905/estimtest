import { transferChildren } from '../dom';
import { activateColorBlind } from './colorBlind';
import { activateFontSize } from './fontSize';
import { activateKeyboardOnly } from './keyboardOnly';

type ColorBlindMatrix = [[number, number, number], [number, number, number], [number, number, number]];
type ColorBlind = (
	'protanopia' | 'protanomaly' |	'deuteranopia' | 'deuteranomaly'
	| 'tritanopia' |	'tritanomaly' | 'achromatopsia' | 'achromatomaly'
	| ColorBlindMatrix
)

interface EstimtestExperiments {
  name: string,
  description: string,
  // Test options
  fontSize?: number,
  colorBlind?: ColorBlind,
  keyboardOnly?: boolean,
}

interface EstimtestExperimentsInternal extends EstimtestExperiments {
  index: number,
  results?: 'pass' | 'fail',
  notes?: string,
}

interface EstimtestWrapper {
  container: HTMLDivElement,
  content: HTMLDivElement,
}

const resetTest = (hostElement: HTMLElement) => {
	const parent = hostElement.parentElement;
	let container = parent.querySelector(':scope > #estimtest-container');
	let content = parent.querySelector<HTMLElement>(':scope > #estimtest-container > #estimtest-content');

	if (content) {
		transferChildren(
			content,
			hostElement.parentElement,
			(node) => node.id?.startsWith('estimtest'),
		);
    
		container.remove();
	}
};

const performTest = (hostElement: HTMLElement, test: EstimtestExperiments) => {
	resetTest(hostElement);

	// Create wrapper element
	const container = document.createElement('div');
	container.id = 'estimtest-container';
	hostElement.before(container);
	const content = document.createElement('div');
	content.id = 'estimtest-content';
	container.appendChild(content);

	transferChildren(
		hostElement.parentElement,
		content,
		(node) => node.id?.startsWith('estimtest') || node.tagName === 'ESTIMTEST-CORE',
	);

	const elements: EstimtestWrapper = {
		container: container,
		content: content,
	};

	if (test.fontSize !== undefined) activateFontSize(elements, test);
	if (test.keyboardOnly === true) activateKeyboardOnly(elements, test);
	if (test.colorBlind !== undefined) activateColorBlind(elements, test);
};

export type { EstimtestExperiments, EstimtestExperimentsInternal, EstimtestWrapper, ColorBlind, ColorBlindMatrix };
export { resetTest, performTest };