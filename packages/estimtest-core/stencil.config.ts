import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { sass } from '@stencil/sass';

export const config: Config = {
	namespace: 'estimtest-core',
	taskQueue: 'async',
	plugins: [
		sass({
			injectGlobalPaths: ['./src/styles/index.scss'],
		})
	],
	outputTargets: [
		reactOutputTarget({
			componentCorePackage: 'estimtest-core',
			proxiesFile: '../estimtest-react/src/components.ts',
		}),
		angularOutputTarget({
			componentCorePackage: 'estimtest-core',
			directivesProxyFile: '../estimtest-angular/src/directives/components.ts',
			directivesArrayFile: '../estimtest-angular/src/directives/index.ts',
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