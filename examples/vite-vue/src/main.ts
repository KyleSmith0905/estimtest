import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

if (import.meta.env.VITE_ESTIMTEST === 'true') {
  const { EstimtestLibrary } = require('estimtest-vue');
  app.use(EstimtestLibrary);
}
app.use(createPinia())
app.use(router)

app.mount('#app')
