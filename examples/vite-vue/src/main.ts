import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App);

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('estimtest')
if (import.meta.env.VITE_ESTIMTEST === 'true') {
  import('estimtest-vue').then(({EstimtestLibrary}) => {
    app.use(EstimtestLibrary);
  });
}
app.use(createPinia())
app.use(router)

app.mount('#app')
