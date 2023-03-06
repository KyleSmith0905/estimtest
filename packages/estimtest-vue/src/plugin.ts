import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from 'estimtest-core/loader';

export const EstimtestLibrary: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};