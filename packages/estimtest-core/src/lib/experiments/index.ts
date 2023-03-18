import { EstimtestAttributes } from '../config';
import { transferChildren, transferElement } from '../dom';
import { activateColorBlind } from './colorBlind';
import { activateFontSize } from './fontSize';
import { activateKeyboardOnly } from './keyboardOnly';
import { EstimtestExperiments } from 'shared';

interface EstimtestExperimentsInternal extends EstimtestExperiments {
  index: number,
  results?: 'pass' | 'fail',
  notes?: string,
}

interface EstimtestWrapper {
  container: HTMLDivElement,
  content: HTMLDivElement,
  foreground: HTMLDivElement,
	host: HTMLElement,
}

const resetTest = (hostElement: HTMLElement) => {
	const parent = hostElement.parentElement;
	let container = parent.querySelector(':scope > #estimtest-container');
	let content = parent.querySelector<HTMLElement>(':scope > #estimtest-container > #estimtest-content');

	// Revert back the estimtest container structure
	if (content) {
		transferChildren(
			content,
			hostElement.parentElement,
			(node) => node.id?.startsWith('estimtest'),
		);
    
		container.remove();
	}

	// Revert changes in font-size
	document.documentElement.style.setProperty('font-size', document.documentElement.dataset.beforeFontSize);
	document.documentElement.removeAttribute('data-before-font-size');
};

const performTest = (hostElement: HTMLElement, test: EstimtestExperiments, config: EstimtestAttributes) => {
	resetTest(hostElement);

	// Move estimtest-core component to user-specified location
	if (typeof config.moveSelector === 'string') {
		const newParent = document.querySelector<HTMLElement>(config.moveSelector);
		transferElement(
			hostElement,
			newParent,
		);
	}

	// Create wrapper element
	const container = document.createElement('div');
	container.id = 'estimtest-container';
	container.style.setProperty('width', '100%');
	hostElement.before(container);

	const content = document.createElement('div');
	content.id = 'estimtest-content';
	container.appendChild(content);
	
	const foreground = document.createElement('div');
	foreground.id = 'foreground-content';
	foreground.style.setProperty('position', 'fixed');
	foreground.style.setProperty('inset', '0rem');
	foreground.style.setProperty('z-index', '1000');
	foreground.style.setProperty('pointer-events', 'none');
	container.appendChild(foreground);

	transferChildren(
		hostElement.parentElement,
		content,
		(node) => node.id?.startsWith('estimtest') || node.tagName === 'ESTIMTEST-CORE',
	);

	const elements: EstimtestWrapper = {
		container: container,
		content: content,
		foreground: foreground,
		host: hostElement,
	};

	if (test.fontSize !== undefined) activateFontSize(elements, test);
	if (test.keyboardOnly === true) activateKeyboardOnly(elements, test);
	if (test.colorBlind !== undefined) activateColorBlind(elements, test);
};

export type { EstimtestExperiments, EstimtestExperimentsInternal, EstimtestWrapper, ColorBlind, ColorBlindMatrix };
export { resetTest, performTest };