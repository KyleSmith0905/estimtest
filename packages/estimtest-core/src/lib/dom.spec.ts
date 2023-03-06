import { conditionallySetInert, getEventValue } from './dom';

describe('dom methods', () => {
	it('get event values', async () => {
		// @ts-expect-error
		const result = getEventValue({target: {value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}});
		expect(result).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
	});

	it('conditionally set inert', () => {
		const invoker = conditionallySetInert(true);

		const mockElement = {
			setAttribute: () => null,
			removeAttribute: () => null,
		};

		const spyMethod = spyOn(mockElement, 'removeAttribute');
    
		// @ts-expect-error
		invoker(mockElement);

		expect(spyMethod).toBeCalled();
	});

	it('conditionally remove inert', () => {
		const invoker = conditionallySetInert(false);

		const mockElement = {
			setAttribute: () => null,
			removeAttribute: () => null,
		};

		const spyMethod = spyOn(mockElement, 'setAttribute');
    
		// @ts-expect-error
		invoker(mockElement);

		expect(spyMethod).toBeCalled();
	});
});