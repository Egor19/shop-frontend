<template>
  <div class="filter-aside relative top-[80px] left-0 w-[400px] p-5 bg-white shadow-xl overflow-y-auto box-border rounded-xl">
    <h3 class="text-lg font-bold mb-4">Фильтры</h3>

    <!-- Фильтрация по цене -->
    <div class="filter-price mb-5">
      <h4 class="text-md font-medium mb-2">Цена</h4>
      <div class="relative">
        <!-- Полоса с двумя бегунками -->
        <div v-if="filterList.price" class="range-container relative w-full">
          <input
            type="range"
            :min= "filterList.price.min"
            :max= "filterList.price.max"
            v-model.number="priceRange.min"
            class="range-slider"
            :style="{ backgroundSize: priceRange.backgroundSize }"
          />
          <input
            type="range"
            :min= "filterList.price.min"
            :max="filterList.price.max"
            v-model.number="priceRange.max"
            class="range-slider"
            :style="{ backgroundSize: priceRange.backgroundSize }"
          />
        </div>
        
        <!-- Текст значений цены -->
        <div class="price-values flex justify-between text-sm text-gray-600 mt-6">
          <span>{{ priceRange.min}} ₽</span> - <span>{{ priceRange.max }} ₽</span>
        </div>
      </div>
    </div>

    <!-- Фильтрация по цвету -->
    <div class="filter-color mb-5">
      <h4 class="text-md font-medium mb-2">Цвет</h4>
      <div class="color-options flex flex-wrap gap-2">
        <div
          v-for="(color, index) in filterList.colors"
          :key="index"
          class="color-option w-7 h-7 rounded-md cursor-pointer border-2 border-transparent transition-all ease-in-out duration-200"
          :style="{
                    backgroundColor: color.title,
                    borderColor: selectColors.includes(color.id) ? 'black' : 'transparent'
                  }"
                  @click.prevent="selectedColor(color.id)"
        ></div>
      </div>
      
    </div>

     <!-- Фильтрация по категории -->
     <div class="filter-category mb-5">
  <h4 class="text-md font-medium mb-2">Выберите категорию</h4>
  <div class="radio-item">
    <form>
      <div
        v-for="category in filterList.categories"
        :key="category.id"
        class="form-group flex items-center mb-3"
      >
        <input
          type="radio"
          :id="'category-' + category.id"
          :value="category.id"
          v-model="selectedCategory"
          class="hidden"
        />
        <label
          :for="'category-' + category.id"
          class="radio-label flex items-center cursor-pointer"
        >
          <span class="radio-circle w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0 mr-2 transition-all"></span>
          {{ category.title }}
        </label>
      </div>
    </form>
  </div>
</div>

       <!-- Фильтрация по тегам -->
    <div class="filter-tags mb-5">
      <h4 class="text-md font-medium mb-2">Теги</h4>
      <div class="tags-container p-4">
        <ul class="popular-tag flex flex-wrap gap-3">
          <div v-for="tag in filterList.tags" :key="tag.id" class="form-group"> 
          <li><a 
            href="#0" 
            @click="selectedTag(tag.title)" 
            class="tag-item"
            :class="{'selected-tag': selectTags.includes(tag.title)}">
            {{ tag.title }}
          </a></li>
        </div>
        </ul>
      </div>
    </div>
     
     <!-- Кнопка применить -->
     <div class="apply-button text-center mt-6">
      <button
        @click.prevent="getProductList()"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all duration-200"
      >
        Применить
      </button>
    </div>


  </div>

  
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      priceRange: {
           min: null,
           max: null,
      },
      filterList: [],
  
         // colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"], // Массив цветов
         selectColors: [], // Выбранный цвет
         selectedCategory: null, // Категории
         selectTags: [], // Массив выбранных тегов
      
    };
  },

  mounted() { 

this.getFilter()
},


  methods: {
    selectedColor(colorId) {
  if (this.selectColors.includes(colorId)) {
    this.selectColors = this.selectColors.filter(id => id !== colorId); // Убираем цвет, если он уже выбран

  } else {
    this.selectColors.push(colorId); // Добавляем цвет в список выбранных
  }
},

    selectedTag(tag) {
      if (this.selectTags.includes(tag)) {
        this.selectTags = this.selectTags.filter(t => t !== tag); // Убираем тег, если он уже выбран
      } else {
        this.selectTags.push(tag); // Добавляем тег в список выбранных
      }
    },
    
    getFilter() {
        axios.get('http://localhost:8876/api/products/list')
        .then( res => {
            console.log(res.data)
           
            this.filterList = res.data
            this.priceRange.min = this.filterList.price.min;
            this.priceRange.max = this.filterList.price.max;
        })
        .catch(error => {
          console.error('Ошибка при получении данных:', error);
        });
    },

    getProductList() {
      
      axios.post('http://localhost:8876/api/products/filter', {
        'categories' : this.selectedCategory,
        'tags' : this.selectTags,
        'colors' : this.selectColors,
        'prices' : this.priceRange,

      })
      .then(response => {
        console.log('Ответ сервера:', response.data);
        

    this.$emit('apply-filters', response.data.data)
})
.catch(error => {
    console.error('Ошибка:', error);
});
      console.log({
    categories: this.selectedCategory,
    tags: this.selectTags,
    colors: this.selectColors,
    prices: this.priceRange,
});

        
    },
    


  }
};
</script>

<style scoped>

.radio-item .form-group {
  display: flex;
  align-items: center;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  user-select: none;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.radio-circle::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

input[type="radio"]:checked + .radio-label .radio-circle {
  border-color: #4caf50;
}

input[type="radio"]:checked + .radio-label .radio-circle::after {
  background-color: #4caf50;
}

.checkbox-item {
  margin-bottom: 1rem;
}

.checkbox-item .form-group {
  margin-bottom: 0.5rem;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.popular-tag {
  list-style: none;
  padding: 0;
  margin: 0;
}

.popular-tag li {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 5px;
}

.popular-tag a {
  text-decoration: none;
  color: #4caf50;
  font-size: 14px;
}

.popular-tag a:hover {
  text-decoration: underline;
}

.range-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.range-slider:nth-child(1) {
  z-index: 2;
}

.range-slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #4caf50, #4caf50);
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  margin-top: -6px; /* Центрируем бегунок по вертикали */
}

.range-slider::-moz-range-track {
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #4caf50, #4caf50);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  margin-top: -6px; /* Центрируем бегунок по вертикали */
}

.tag-item {
  text-decoration: none;
  background-color: #fafafa;
  color: #4caf50;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 8px;
  margin-bottom: 8px;
  border: 1px solid #4caf50;
  display: inline-block;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tag-item:hover {
  background-color: #4caf50;
  color: white;
}

.tag-item.selected-tag {
  background-color: #4caf50;
  color: white;
}

.tags-container {
  margin-top: 10px;
}

.tag-item {
  text-decoration: none;
  background-color: #fafafa;
  color: #4caf50;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 8px;
  margin-bottom: 8px;
  border: 1px solid #4caf50; /* Рамка для каждого тега */
  display: inline-block;
}

.tag-item:hover {
  background-color: #4caf50;
  color: white;
}

.range-container {
  position: relative;
  height: 8px;
}

.range-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.range-slider:nth-child(1) {
  z-index: 2;
}

.range-slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #4caf50, #4caf50);
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  margin-top: -6px; /* Центрируем бегунок по вертикали */
}

.range-slider::-moz-range-track {
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #4caf50, #4caf50);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  margin-top: -6px; /* Центрируем бегунок по вертикали */
}

.price-values {
  position: relative;
  z-index: 3; /* Убираем перекрытие текста ползунками */
  margin-top: 20px; /* Добавляем отступ снизу */
}

h3, h4 {
  font-family: 'Helvetica Neue', sans-serif;
}

h4 {
  font-weight: 500;
}

h3 {
  font-weight: 700;
  text-transform: uppercase;
}
</style>
