<template>
  <article class="mt-4 max-w-[900px]">
    <div class="mb-4 flex items-start">
      <div class="flex items-center gap-4">
        <div class="avatar">
          <div class="w-24 rounded-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <div class="font-medium dark:text-white">
          <p>
            {{ review.user.name }}
            <span class="block text-sm text-gray-500 dark:text-gray-400">{{
              review.user.email
            }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="mb-1 flex items-center space-x-1 rtl:space-x-reverse">
      <!-- Звёздочки сюда -->
      <div class="rating">
        <input
          v-for="count in 5"
          :key="count"
          type="radio"
          :name="`rating-${uniqId}`"
          class="mask mask-star-2 bg-orange-400"
          :aria-label="`${count} star`"
          :checked="count === rating"
          disabled
        />
      </div>
    </div>

    <footer class="mb-5 text-sm text-gray-500 dark:text-gray-400">
      <p>
        Написано
        <time>{{
          formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1)
        }}</time>
      </p>
    </footer>
    <p class="mb-2 text-gray-500 dark:text-gray-400">
      {{ review.text }}
    </p>
    <hr />
    <aside></aside>
  </article>
</template>

<script setup lang="ts">
import type { Review } from '~/modules/shared/types/type'

const props = defineProps<{
  rating: number
  review: Review
}>()

const uniqId = ref(Math.random())

const formatedDate = computed(() => {
  const date = new Date(props.review.created_at)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
input[type='radio'] {
  cursor: default;
}
</style>
