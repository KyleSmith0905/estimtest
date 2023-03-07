import { Plugin } from 'vue';

export const EstimtestLibrary: Plugin = {
  async install() {
    const { applyPolyfills, defineCustomElements } = await import('estimtest-core/loader');
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};