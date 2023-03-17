import { newE2EPage } from '@stencil/core/testing';
import { EstimtestAttributes } from '../../lib/config';

/**
 * Note, I have an issue with manually clicking buttons. Doing `E2EElement.click()` might not work.
 * In exchange I call the function the button is invoking instead.
 */

describe('estimtest-core', () => {
	it('renders', async () => {
		const page = await newE2EPage();

		await page.setContent('<estimtest-core></estimtest-core>');
		const element = await page.find('estimtest-core');
		expect(element).toHaveClass('hydrated');
	});

	it('simulate beginning to end process', async () => {
		const page = await newE2EPage();

		const experiments: EstimtestAttributes['experiments'] = [
			{
				name: 'Lorem, ipsum dolor.',
				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, nihil.',
				fontSize: 16,
			},
			{
				name: 'Lorem, ipsum dolor.',
				description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, nihil.',
				fontSize: 18,
			},
		];

		await page.setContent(`<estimtest-core></estimtest-core>`);

		const component = await page.find('estimtest-core');
		component.setProperty('experiments', experiments);

		const promptBox = await page.find('estimtest-core >>> *[data-test=prompt-box]');
		const testBox = await page.find('estimtest-core >>> *[data-test=test-box]');
		const finishBox = await page.find('estimtest-core >>> *[data-test=finish-box]');

		expect(promptBox.getAttribute('inert')).toBeNull();
		expect(testBox.getAttribute('inert')).toBeTruthy();
		expect(finishBox.getAttribute('inert')).toBeTruthy();

		await component.callMethod('startExperiments');
		await page.waitForChanges();
		expect(promptBox.getAttribute('inert')).toBeTruthy();
		expect(testBox.getAttribute('inert')).toBeNull();
		expect(finishBox.getAttribute('inert')).toBeTruthy();

		await component.callMethod('nextExperiment', 'fail');
		await page.waitForChanges();
		expect(promptBox.getAttribute('inert')).toBeTruthy();
		expect(testBox.getAttribute('inert')).toBeNull();
		expect(finishBox.getAttribute('inert')).toBeTruthy();

		await component.callMethod('nextExperiment', 'pass');
		await page.waitForChanges();
		expect(promptBox.getAttribute('inert')).toBeTruthy();
		expect(testBox.getAttribute('inert')).toBeTruthy();
		expect(finishBox.getAttribute('inert')).toBeNull();
    
		await component.callMethod('promptBeginExperiments');
		await page.waitForChanges();
		expect(promptBox.getAttribute('inert')).toBeNull();
		expect(testBox.getAttribute('inert')).toBeTruthy();
		expect(finishBox.getAttribute('inert')).toBeTruthy();
	});
});