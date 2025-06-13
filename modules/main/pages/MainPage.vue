<template>
  <div class="flex flex-col items-center justify-center gap-12 pt-8 pb-8">
    <!-- Лого на главной страницы -->
    <div
      class="hero h-[265px] max-w-[840px]"
      style="
        background-image: url(https://icba.su/upload/iblock/175/1753d9c8ab38f78f757a307251f7d1ad.jpg);
      "
    >
      <div class="hero-overlay"></div>
      <div class="hero-content text-neutral-content text-center">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">Ювелирные украшения</h1>
          <p class="mb-5 font-bold">
            Большой ассортимент ювелирных украшений, с определением тональности
            по отзывам
          </p>
        </div>
      </div>
    </div>

    <!-- Фильтры по категориям -->

    <div class="flex max-w-[900px] grid-cols-2 flex-wrap gap-2 filter">
      <button
        v-for="category in categories"
        :key="category.id"
        class="btn"
        :class="{
          'btn-primary text-white': selectedCategory === category.nameCategory
        }"
        @click="handleCategoryFilter(category)"
      >
        {{ category.nameCategory }}
      </button>
      <button
        v-if="selectedCategory !== ''"
        class="btn btn-square btn-ghost"
        @click="handleReset"
      >
        <X stroke-width="1" />
      </button>
    </div>

    <!-- Поиск -->
    <div class="justify flex w-full max-w-[900px] gap-2">
      <div class="join mt-6 items-center">
        <input
          v-model="searchProducts"
          class="input join-item input-xs border-1"
          type="search"
          placeholder="Поиск"
        />
      </div>
      <select
        v-model="selectedSort"
        class="select select-xs mt-6 border-1"
        @change="handleSort(selectedSort)"
      >
        <option value="DEFAULT">Порядок: по умолчанию</option>
        <option value="asc">Цена: По возрастанию</option>
        <option value="desc">Цена: По убыванию</option>
      </select>

      <!-- Фильтры по рейтингу и тональности -->
      <div class="relative flex w-full max-w-[900px] gap-2">
        <div class="form-control w-40">
          <label class="label">
            <span class="label-text text-xs">Рейтинг</span>
          </label>
          <select
            v-model="minRating"
            class="select select-bordered select-xs border"
            @change="handleFilterByRatingAndTone"
          >
            <option :value="null">Любой</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <div class="form-control w-40">
          <label class="label">
            <span class="label-text text-xs">Отзывы</span>
          </label>
          <select
            v-model="minTone"
            class="select select-bordered select-xs border"
            @change="handleFilterByRatingAndTone"
          >
            <option :value="null">Любая</option>
            <option :value="-1">Нейтральные</option>
            <option :value="0">Отрицательные</option>
            <option :value="1">Положительные</option>
          </select>
        </div>

        <button
          class="btn btn-xs relative top-6"
          @click="resetRatingToneFilters"
        >
          Сбросить
        </button>
      </div>
    </div>

    <!-- Карточки товара -->
    <div
      v-if="!isLoadingProducts"
      class="mx-auto grid max-w-[900px] grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="card in filteredProducts"
        :key="card.id"
        class="card w-full border-blue-600 shadow-sm"
      >
        <figure class="">
          <img
            :src="card.imgUrlProduct"
            alt="Shoes"
            class="rounded-xl rounded-b-none"
          />
        </figure>
        <div class="card-body rounded-t-none">
          <h2 class="card-title">
            {{ card.nameProduct }}
            <div class="badge badge-secondary p-2">
              {{ new Intl.NumberFormat('ru-RU').format(card.priceProduct) }}р
            </div>
          </h2>
          <div
            v-if="card.avgRating !== 0"
            class="flex flex-wrap items-center justify-between"
          >
            <strong>Средний рейтинг</strong>
            <span class="text-orange-600">{{ card.avgRating }}</span>
          </div>
          <div
            v-if="card.avgTone !== 0"
            class="flex flex-wrap items-center justify-between"
          >
            <strong>Средняя тональность</strong>
            <span class="text-green-600">{{ card.avgTone }}</span>
          </div>
          <p>
            {{ truncate(card.descriptionProduct) }}
          </p>

          <button
            class="btn btn-primary"
            :disabled="card.quantityProduct === 0"
            @click="navigateTo({ name: 'product', params: { id: card.id } })"
          >
            {{ card.quantityProduct === 0 ? 'Нет в наличии' : 'Подробнее' }}
          </button>
        </div>
      </div>
    </div>
    <!-- Скелетоны -->
    <div
      v-else
      class="grid max-w-[900px] grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div v-for="i in 6" :key="i" class="mx-4 flex w-[300px] flex-col gap-4">
        <div class="skeleton h-32 w-full"></div>
        <div class="skeleton h-4 w-28"></div>
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-full"></div>
      </div>
    </div>

    <!-- Ничего не найдено -->
    <div v-if="filteredProducts.length === 0 && !isLoadingProducts" class="">
      <p>Ничего не нашлось</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductList } from '~/modules/shared/composables/useProductList'
import { X } from 'lucide-vue-next'
definePageMeta({
  layout: 'custom'
})

const {
  categories,
  isLoadingProducts,
  selectedCategory,
  searchProducts,
  selectedSort,
  filteredProducts,
  minRating,
  minTone,
  fetchInitialData,
  handleReset,
  handleCategoryFilter,
  handleSort,
  handleFilterByRatingAndTone,
  truncate
} = useProductList()

onMounted(async () => {
  await fetchInitialData()
})

const resetRatingToneFilters = () => {
  minRating.value = null
  minTone.value = null
  handleFilterByRatingAndTone()
}
</script>

<style scoped></style>
