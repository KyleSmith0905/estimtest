import { EstimtestTest } from './tests';

interface EstimtestConfig {
	tests: Pick<EstimtestTest, 'name' | 'description' | 'fontSize' | 'width' | 'height' | 'keyboardOnly'>[];
}

const defaultEstimtestConfig: EstimtestConfig = {
	tests: [
		{
			name: 'Large Font Size',
			description:
				'Many users have difficulty reading text at the default size. Users often solve this issue by increasing the browser\'s font size. To accommodate these users, it is suggested to use `rem` instead of `px` for `font-size`.',
			fontSize: 24,
		},
		{
			name: 'Mobile Screen Size',
			description: 'Most people who surf the internet are on a mobile phone. It is important to accommodate small screen sizes to maintain a positive impression on users.',
			width: 320,
			height: 480,
		},
		{
			name: 'Keyboard Navigation',
			description: `
Many users may use keyboard navigation for a variety of reasons such as: Motor impairment, saving time, and more.\\
Here is a list of useful shortcuts for Chromium.

---
**Browse clickable items moving forward**\\
\`Tab\`\\
**Browse clickable items moving backward**\\
\`Shift + Tab\`\\
**Scroll down a webpage, a screen at a time**\\
\`Space\`\\
**Scroll up a webpage, a screen at a time**\\
\`Shift + Space\`
			`,
			keyboardOnly: true,
		},
	],
};

export type { EstimtestConfig };
export { defaultEstimtestConfig };
