import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'estimtest-core',
  taskQueue: 'async',
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: 'estimtest-core',
      proxiesFile: '../estimtest-react/src/components.ts',
    }),
    {
      type: 'dist-custom-elements',
      dir: 'components'
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  buildEs5: 'prod',
  extras: {
    initializeNextTick: true,
    scriptDataOpts: true
  },
  devServer: {
    reloadStrategy: 'pageReload',
  },
};