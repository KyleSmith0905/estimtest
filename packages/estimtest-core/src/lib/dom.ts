import { sleep } from './time';

const autoResizeTextarea = async (element?: HTMLTextAreaElement) => {
	if (element instanceof HTMLElement) {
		// Wait an event loop until it's hydrated fully
		if (element.scrollHeight === 0) await sleep();

		const paddingTop = parseFloat(
			getComputedStyle(element).paddingTop.replace(/\p\x/g, '')
		);
		const paddingBottom = parseFloat(
			getComputedStyle(element).paddingBottom.replace(/\p\x/g, '')
		);
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

export {getEventValue, autoResizeTextarea};