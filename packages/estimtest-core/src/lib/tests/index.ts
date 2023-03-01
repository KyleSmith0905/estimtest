import { transferChildren } from '../dom';
import { activateFontSize } from './fontSize';
import { activateHeight } from './height';
import { activateKeyboardOnly } from './keyboardOnly';
import { activateWidth } from './width';

interface EstimtestTest {
  name: string,
  index: number,
  description: string,
  results?: 'pass' | 'fail',
  notes?: string,
  // Test options
  fontSize?: number,
  width?: number,
  height?: number,
  keyboardOnly?: boolean,
}

const resetTest = (hostElement: HTMLElement) => {
	const parent = hostElement.parentElement;
	let container1 = parent.querySelector(':scope > #estimtest-container-1');
	let container2 = parent.querySelector<HTMLElement>(':scope > #estimtest-container-1 > #estimtest-container-2');

	if (container2) {
		transferChildren(
			container2,
			hostElement.parentElement,
			(node) => node.id.startsWith('estimtest'),
		);
    
		container1.remove();
		container2.remove();
	}
};

const performTest = (hostElement: HTMLElement, test: EstimtestTest) => {
	resetTest(hostElement);

	// Create wrapper element
	const container1 = document.createElement('div');
	container1.id = 'estimtest-container-1';
	hostElement.before(container1);
	const container2 = document.createElement('div');
	container2.id = 'estimtest-container-2';
	container1.appendChild(container2);

	const container3 = document.createElement('object');
	container3.id = 'estimtest-container 3';
	container2.appendChild(container3);

	transferChildren(
		hostElement.parentElement,
		container3,
		(node) => node.id.startsWith('estimtest') || node.tagName === 'ESTIMTEST-CORE',
	);

	if (test.fontSize !== undefined) activateFontSize(container2, test);
	if (test.width !== undefined) activateWidth(container2, test);
	if (test.height !== undefined) activateHeight(container2, test);
	if (test.keyboardOnly === true) activateKeyboardOnly(container2, test);
};

export type { EstimtestTest };
export { resetTest, performTest };