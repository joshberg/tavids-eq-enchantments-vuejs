import { createPinia } from 'pinia';
import { createApp } from 'vue';

import applyPrototypes from '@/helpers/applyPrototypes.js';

import App from './AppTarget.vue';

import 'purecss';
import '@/assets/main.css';

const app = createApp(App);
applyPrototypes(app.config.globalProperties);
app.use(createPinia());

import './js/buffer.js';

app.mount('#app-target');
