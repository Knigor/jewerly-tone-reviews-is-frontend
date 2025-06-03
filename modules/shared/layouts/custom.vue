<template>
  <div class="flex min-h-screen flex-col">
    <Header
      v-model:is-open="isOpen"
      v-model:user-role="authStore.user!.role"
      @log-out="handleLogOut"
      @open-cart="isOpen = !isOpen"
    />
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="p-3 text-start text-sm text-gray-600">
      @ ВКР Разработка информационной системы с рейтингом товаров на основе
      тональности отзывов покупателей ювелирного магазина
    </footer>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue'
import { useAuth } from '~/modules/auth/composables/useAuth'
import { useAuthStore } from '~/modules/auth/store/authStore'

const authStore = useAuthStore()
const { logOut } = useAuth()

// открываем и закрываем модалку с корзиной
const isOpen = ref<boolean>(false)

const handleLogOut = async () => {
  try {
    const response = await logOut()

    if (response.success) {
      navigateTo('/')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  header,
  footer {
    padding: 2rem;
  }
  h1 {
    font-size: 1.5rem;
  }
}
</style>
