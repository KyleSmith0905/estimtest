import { newSpecPage } from '@stencil/core/testing';
import { Estimtest } from './core';

describe('estimtest-core', () => {
	it('renders', async () => {
		const { root } = await newSpecPage({
			components: [Estimtest],
			html: '<estimtest-core></estimtest-core>',
		});
		expect(root.tagName).toEqual('ESTIMTEST-CORE');

		expect(root.shadowRoot.firstChild).toHaveClass('full-screen');
	});

	it('does not render when not active', async () => {
		const { root } = await newSpecPage({
			components: [Estimtest],
			html: '<estimtest-core active="false"></estimtest-core>',
		});

		expect(root).toEqualHtml(`
      <estimtest-core active="false">
        <mock:shadow-root></mock:shadow-root>
      </estimtest-core>
    `);
	});
});