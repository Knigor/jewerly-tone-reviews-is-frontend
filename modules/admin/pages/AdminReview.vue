<template>
  <div class="flex flex-col items-center justify-center gap-12 pt-8 pb-8">
    <!-- Поиск -->
    <div class="mr-4 flex w-full max-w-[900px] justify-end gap-2">
      <div class="join">
        <input
          v-model="searchReview"
          class="input join-item input-xs border-1"
          type="search"
          placeholder="Поиск"
        />
      </div>

      <select
        v-model="selectedSort"
        class="select select-xs border-1"
        @change="handleSort(selectedSort)"
      >
        <option value="default">Порядок: по умолчанию</option>
        <option value="success">Порядок: Прошли модерацию</option>
        <option value="pending">Порядок: Не прошли модерацию</option>
      </select>
    </div>

    <div class="mr-4 flex w-full max-w-[900px] justify-end gap-4">
      <p class="link link-accent underline-offset-4" @click="$router.back()">
        Назад
      </p>
    </div>

    <!-- Отзывы -->

    <div
      class="scrollbar-thumb-gray-600 scrollbar-thin scrollbar-track-gray-300 h-[600px] overflow-auto"
    >
      <ReviewRatingAdmin
        v-for="item in filteredReview"
        :key="item.id"
        :review="item"
        :rating="item.rating"
        @delete-review="handleDeleteReview"
        @success-review="successReview"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReviewRatingAdmin from '../components/ReviewRatingAdmin.vue'
import { useReviews } from '~/modules/shared/composables/useReviews'
import type { Review } from '~/modules/shared/types/type'

definePageMeta({
  layout: 'custom'
})

const { getAllReviews, moderationReview, deleteReview } = useReviews()
const { $toast } = useNuxtApp()
const review = ref<Review[]>()
const allReview = ref<Review[]>()
const isLoadingProduct = ref(false)
const selectedSort = ref('default')
const searchReview = ref('')

onMounted(async () => {
  isLoadingProduct.value = true
  try {
    const response = await getAllReviews()
    allReview.value = response
    review.value = response
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingProduct.value = false
  }
})

const handleSort = async (sort: string) => {
  if (selectedSort.value === 'default') {
    selectedSort.value = sort
    isLoadingProduct.value = true
    try {
      const response = await getAllReviews()
      review.value = response
      allReview.value = response
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingProduct.value = false
    }
  } else if (selectedSort.value === 'success') {
    selectedSort.value = sort
    isLoadingProduct.value = true
    try {
      review.value = allReview.value?.filter((item) => {
        return item.is_moderate === true
      })
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingProduct.value = false
    }
  } else if (selectedSort.value === 'pending') {
    selectedSort.value = sort
    isLoadingProduct.value = true
    try {
      review.value = allReview.value?.filter((item) => {
        return item.is_moderate === false
      })
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingProduct.value = false
    }
  }
}

const filteredReview = computed(() => {
  return review.value?.filter((item) => {
    return (
      item.created_at
        .toLowerCase()
        .includes(searchReview.value.toLowerCase()) ||
      item.text.toLowerCase().includes(searchReview.value.toLowerCase())
    )
  })
})

async function successReview(id: number) {
  try {
    await moderationReview(id, true)
    const index = review.value?.findIndex((item) => item.id === id)
    if (index !== -1 && review.value) {
      review.value[index as number].is_moderate = true
    }
    $toast.success('Отзыв одобрен')
  } catch (error) {
    console.error('Не удалость одобрить отзыв', error)
  }
}

async function handleDeleteReview(id: number) {
  try {
    await deleteReview(id)
    const index = review.value?.findIndex((item) => item.id === id)
    if (index !== -1 && review.value) {
      review.value.splice(index as number, 1)
    }
    $toast.success('Отзыв удален')
  } catch (error) {
    console.error('Не удалость удалить отзыв', error)
  }
}
</script>

<style scoped></style>
