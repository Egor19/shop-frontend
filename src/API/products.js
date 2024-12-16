import axios from 'axios';

// Функция для получения всех продуктов
export function getProducts() {
  return axios.get('http://localhost:8876/api/products');
}

// Функция для получения отфильтрованных продуктов
export function getFilteredProducts(filters) {
  return axios.post('http://localhost:8876/api/products/filter', filters);
}
