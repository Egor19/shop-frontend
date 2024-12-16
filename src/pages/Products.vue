<script>
import axios from 'axios';
import Card from '../components/Card.vue';
import Aside from '../components/Aside.vue';

export default {
name: "products",
components: {
    Card,  // Добавляем компонент в раздел components
    Aside,
  },

  data() {
    return {
      products: [], // Это будет массив с продуктами
    };
  },

mounted() { 

    this.getProducts()

},


methods: {

  applyFilters(filterData) {
    this.products = filterData;
  },
    getProducts() {
        axios.get('http://localhost:8876/api/products')
        .then( res => {
            this.products = res.data.data;  // Сохраняем полученные продукты
            console.log(res.data.data)
            this.getByName();
        })
        .catch(error => {
          console.error('Ошибка при получении данных:', error);
        });
    },

    getByName() {
        this.products.sort((a, b) => {
            return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
        });
    },

    getAscending() {
    this.products.sort((a, b) => a.price - b.price);
  },
  getDescending() {
    this.products.sort((a, b) => b.price - a.price);
  },
  handleSort(event) {
    const value = event.target.value;
    if (value === 'asc') {
      this.getAscending();
    } else if (value === 'desc') {
      this.getDescending();
    } else if (value === 'name') {
      this.getByName();
    }
  },
}
}
</script>


<template>

<div class="flex">
    <!-- Фиксированное боковое меню -->
    <Aside @apply-filters="applyFilters"/>
  <div class="bg-white w-3/5 m-auto rounded-xl shadow-xl shadow-grey-200 mt-20">
  

    <div class="p-10">
      <div class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-bold">Все кроссовки</h1>
        <div class="flex items-center gap-4">
          <select
            class="py-2 px-3 border border-gray-200 focus:border-gray-400 rounded-md focus:outline-none"
            @change="handleSort($event)"
          >
            <option value="name">По названию</option>
            <option value="asc">По цене (дешевые)</option>
            <option value="desc">По цене (дорогие)</option>
          </select>
          <div class="relative">
            <input
              type="text"
              class="border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400"
              placeholder="Поиск..."
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img src="/search.svg" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-10">
       <div v-for="product in products"
        :key="product.id">
        <Card
        
          :title="product.title"
          :price="product.price"
          :img="product.image_url"
        /></div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
/* Стили для фиксированного бокового меню */
aside {
  position: relative;
  top: 60px; /* если хедер 60px */
  left: 0;
  width: 250px;

  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  z-index: 10; /* Убедитесь, что оно не перекрывается */
}


</style>

