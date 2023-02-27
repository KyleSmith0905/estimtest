import { EstimtestTest } from './tests';

interface EstimtestConfig {
	selectors: {
		container: string;
	};
	tests: Pick<EstimtestTest, 'name' | 'description' | 'fontSize' | 'width' | 'height'>[];
}

const defaultEstimtestConfig: EstimtestConfig = {
	selectors: {
		container: 'body',
	},
	tests: [
		{
			name: 'Large Font Size',
			description:
				"Many users have difficulty reading text at the default size. Users often solve this issue by increasing the browser's font size. To accommodate these users, it is suggested to use `rem` instead of `px` for `font-size`.",
			fontSize: 24,
		},
		{
			name: 'Mobile Screen Size',
			description: 'Most people who surf the internet are on a mobile phone. It is important to accommodate small screen sizes to maintain a positive impression on users.',
			width: 320,
			height: 480,
		},
	],
};

export type { EstimtestConfig };
export { defaultEstimtestConfig };
