<template>
  <div class="hero bg-base max-w-[900px]">
    <div class="hero-content flex-col gap-12 lg:flex-row">
      <img
        :src="product.imgUrlProduct"
        class="max-w-sm rounded-lg shadow-2xl"
      />
      <div>
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-bold">{{ product.nameProduct }}</h1>
          <div class="badge badge-secondary p-2">
            {{ new Intl.NumberFormat('ru-RU').format(product.priceProduct) }}р
          </div>

          <p>
            Цена за
            <span class="text-gray-600">{{ product.productWeight }}</span>
          </p>

          <div class="flex gap-2 py-2">
            <ControllButtons @update:quantity="handleQuantity" />
            <button class="btn btn-primary" @click="handleAddedCart(product)">
              Добавить в корзину
            </button>
            <button class="btn btn-info" @click="handleOpenReview">
              Оставить отзыв
            </button>
          </div>
          <Toaster theme="dark" position="bottom-right" />

          <!-- Модалка на добавление отзыва -->
          <ReviewProduct
            :is-open="isOpen"
            @added-review="handleAddedReview"
            @close-modal="isOpen = false"
          />

          <p>Тип: {{ product.typeProducts }}</p>
          <p class="py-6 text-gray-600">
            {{ product.descriptionProduct }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ControllButtons from '~/modules/shared/components/ControllButtons.vue'
import ReviewProduct from './ReviewProduct.vue'
import type { Product } from '~/modules/shared/types/type'
import { useReviews } from '~/modules/shared/composables/useReviews'
import { useAuthStore } from '~/modules/auth/store/authStore'
import { useCartStore } from '~/modules/shared/store/cartStore'

defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const { $toast } = useNuxtApp()
const { addedReview } = useReviews()
const isOpen = ref(false)
const route = useRoute()
const authStore = useAuthStore()

const currentQuantity = ref(1)

const handleAddedCart = (product: Product) => {
  console.log(
    product.id,
    product.nameProduct,
    currentQuantity.value,
    product.priceProduct
  )
  $toast.success('Товар добавлен в корзину')
  cartStore.addItem(
    product.id,
    currentQuantity.value,
    product.priceProduct,
    product.nameProduct,
    product.imgUrlProduct
  )
}

const handleQuantity = (quantity: number) => {
  currentQuantity.value = quantity
}

const handleAddedReview = async (rating: number, text: string) => {
  try {
    if (authStore.user)
      await addedReview(
        Number(route.params.id),
        authStore.user.id,
        rating,
        text
      )
    $toast.success(`Отзыв отправлен на модерацию`)
    isOpen.value = false
  } catch (error) {
    console.error('Ошибка отправки отзыва', error)
    $toast.error(`В поле оставьте отзыв должно быть минимум 10 символов`)
  }
}

const handleOpenReview = () => {
  isOpen.value = true
}
</script>

<style scoped>
.my-toast {
  border: 1px solid #fda4af;
  color: red;
}
</style>
