import { sleep } from './time';

const autoResizeTextarea = async (element?: HTMLTextAreaElement) => {
	if (element instanceof HTMLElement) {
		// Wait an event loop until it's hydrated fully
		if (element.scrollHeight === 0) await sleep();

		// Account for padding on the textarea
		const paddingTop = parseFloat(
			getComputedStyle(element).paddingTop.replace(/\p\x/g, '')
		);
		const paddingBottom = parseFloat(
			getComputedStyle(element).paddingBottom.replace(/\p\x/g, '')
		);

		// Resets scroll height to zero to have text dictate it
		element.style.setProperty('height', '0px');
		element.style.setProperty(
			'height',
			`${element.scrollHeight - paddingTop - paddingBottom}px`
		);
	}
};

/**
 * Retrieves the value from input and change events.
 */
const getEventValue = (event: Event) => {
	const target = event.target as HTMLInputElement | HTMLTextAreaElement;
	return target.value;
};

const conditionallySetInert = (condition: boolean) => {
	return (element: HTMLElement) => {
		if (!condition) element.setAttribute('inert', 'inert');
		else element.removeAttribute('inert');
	};
};

const transferChildren = (
	oldParent: HTMLElement | ShadowRoot,
	newParent: HTMLElement | ShadowRoot,
	filter: (element: HTMLElement) => boolean
) => {
	oldParent?.childNodes.forEach((node: HTMLElement) => {
		if (filter(node)) return;
		node.parentNode.removeChild(node);
		newParent.appendChild(node);
	});
};

export {getEventValue, autoResizeTextarea, conditionallySetInert, transferChildren};