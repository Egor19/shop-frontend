import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './routes'; 
import axios from 'axios';

const app = createApp(App)
  app.use(router)  // Используем маршруты
  app.mount('#app');
  app.config.globalProperties = axios

