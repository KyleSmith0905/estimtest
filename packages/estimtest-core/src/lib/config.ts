import { EstimtestTest } from './tests';

interface EstimtestConfig {
  selectors: {
    container: string,
  },
  tests: Pick<EstimtestTest, 'name' | 'description' | 'fontSize'>[],
}

const defaultEstimtestConfig: EstimtestConfig = {
  selectors: {
    container: 'body',
  },
  tests: [
    {
      name: 'Large Font Size',
      description: 'Many users have difficulty reading text at the default size. Users often solve this issue by increasing the browser\'s font size. To accommodate these users, it is suggested you use `rem` instead of `px` for `font-size`.',
      fontSize: 24,
    }
  ]
}

export type { EstimtestConfig };
export { defaultEstimtestConfig };