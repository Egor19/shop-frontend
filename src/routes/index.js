// src/routes/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Products from '../pages/Products.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,  // Главная страница
  },
 
  {
    path: '/products',
    name: 'Products',
    component: Products, // Страница с товарами
  },
  // Добавьте другие маршруты по мере необходимости
];

const router = createRouter({
  history: createWebHistory(),  // Используем HTML5 history mode
  routes,
});

export default router;
