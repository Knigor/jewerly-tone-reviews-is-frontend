<template>
  <div
    v-if="!isLoadingProduct"
    class="flex flex-col items-center justify-center gap-12 pt-8 pb-8"
  >
    <!-- Продукт -->
    <ProductComponents v-if="product" :product="product" />
    <div v-else>
      <p class="text-2xl">Ошибка загрузки товара</p>
    </div>

    <div
      class="scrollbar-thumb-gray-600 scrollbar-thin scrollbar-track-gray-300 flex h-[600px] flex-col items-start overflow-auto"
    >
      <!-- Отзывы покупателей-->
      <p class="text-2xl">Отзывы покупателей</p>
      <ReviewRating
        v-for="item in review"
        :key="item.id"
        :rating="item.rating"
        :review="item"
      />
    </div>
  </div>

  <div
    v-else
    class="flex flex-col items-center justify-center gap-12 pt-8 pb-8"
  >
    <!-- Товар -->
    <div>
      <div class="flex w-[600px] flex-col gap-4">
        <div class="skeleton h-54 w-full"></div>
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-full"></div>
      </div>
    </div>
    <!-- Отзывы -->
    <div v-for="i in 3" :key="i">
      <div class="flex w-[600px] flex-col gap-4">
        <div class="flex w-[600px] items-center gap-4">
          <div class="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div class="flex w-[600px] flex-col gap-4">
            <div class="skeleton h-4 w-2/3"></div>
            <div class="skeleton h-4 w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReviewRating from '../components/ReviewRating.vue'
import ProductComponents from '../components/ProductComponents.vue'
import { useProducts } from '~/modules/shared/composables/useProducts'
import { useReviews } from '~/modules/shared/composables/useReviews'
import type { Product, Review } from '~/modules/shared/types/type'
definePageMeta({
  layout: 'custom'
})

const { getProductById } = useProducts()
const { getReviews } = useReviews()

const route = useRoute()
const product = ref<Product>()
const review = ref<Review[]>()
const totalReviews = ref<number>()
const averageRating = ref<number>()
const isLoadingProduct = ref(false)

console.log(route.params.id)

onMounted(async () => {
  isLoadingProduct.value = true
  try {
    await Promise.all([
      getProductById(Number(route.params.id)),
      getReviews(Number(route.params.id))
    ]).then(([prod, rev]) => {
      product.value = prod
      review.value = rev.reviews
      totalReviews.value = rev.total_reviews
      averageRating.value = rev.average_rating
    })
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingProduct.value = false
  }
})
</script>
