<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <NuxtLink
        to="/"
        class="link link-primary text-xl no-underline hover:text-blue-600"
        >Ювелирные украшения</NuxtLink
      >
    </div>

    <div class="mr-4 flex flex-wrap items-end gap-4">
      <!-- Поиск  -->
      <div class="flex gap-2">
        <div class="">
          <div
            class="relative inline-flex flex-col justify-center text-gray-500"
          >
            <input
              id="search"
              v-model="search"
              type="search"
              placeholder="Поиск..."
              class="input input-bordered mt-1 w-full border border-purple-700"
              @input="handleSearch(search)"
              @focus="isFocused = true"
              @blur="handleFocused"
            />
            <Transition name="fade">
              <ul
                v-if="isFocused"
                class="absolute top-10 z-10 mt-2 h-44 w-full overflow-auto rounded-b-md border border-purple-700 bg-white pb-1"
              >
                <!-- Карточки товаров -->
                <div v-if="products?.length > 0">
                  <li
                    v-for="product in products"
                    :key="product.id"
                    class="relative cursor-pointer border-b-2 border-gray-100 px-2 py-1 hover:bg-blue-100 hover:text-gray-900"
                  >
                    <div
                      class="flex items-center gap-1"
                      @click="navigateTo(`/product/${product.id}`)"
                    >
                      <Gem color="#a630a2" />
                      <span>{{ product.nameProduct }}</span>
                    </div>
                  </li>
                </div>

                <!-- Ничего не найдено -->
                <div
                  v-else
                  class="absolute top-14 left-10 flex flex-col items-center justify-center"
                >
                  <Frown :size="40" />
                  <p class="text-gray-600">Ничего не найдено</p>
                </div>
              </ul>
            </Transition>
          </div>
        </div>
      </div>
      <!-- Иконки -->

      <div class="dropdown dropdown-end flex gap-2">
        <!-- Иконка корзины -->

        <h1 class="flex items-center text-gray-900">
          {{ authStore.user?.name }}
        </h1>

        <div
          v-if="!cartStore.isEmpty"
          :class="
            cartStore.isEmpty
              ? 'tooltip-disabled'
              : 'tooltip tooltip-primary hover:tooltip-open tooltip-bottom'
          "
          data-tip="Открыть"
        >
          <div
            role="button"
            class="btn btn-ghost btn-circle"
            @click="$emit('openCart')"
          >
            <div class="indicator">
              <ShoppingCart />
              <span class="badge badge-sm indicator-item">{{
                cartStore.totalItems
              }}</span>
            </div>
          </div>
        </div>

        <!-- Иконка заказов -->

        <div
          v-if="userRole === 'ROLE_ADMIN'"
          class="tooltip tooltip-primary hover:tooltip-open tooltip-bottom"
          data-tip="Заказы"
        >
          <div
            role="button"
            class="btn btn-ghost btn-circle"
            @click="navigateTo('/admin-orders')"
          >
            <div class="indicator">
              <ArrowRightLeft />
            </div>
          </div>
        </div>

        <!-- Иконка админа -->
        <div
          v-if="userRole === 'ROLE_ADMIN'"
          class="tooltip tooltip-primary hover:tooltip-open tooltip-bottom"
          data-tip="Админка"
        >
          <div
            role="button"
            class="btn btn-ghost btn-circle"
            @click="navigateTo('/admin-main')"
          >
            <div class="indicator">
              <ShieldUser />
            </div>
          </div>
        </div>

        <!-- Иконка выхода -->

        <div
          class="tooltip tooltip-primary hover:tooltip-open tooltip-bottom"
          data-tip="Выход"
        >
          <div
            role="button"
            class="btn btn-ghost btn-circle"
            @click="$emit('logOut')"
          >
            <div class="indicator">
              <LogOut />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CartModal v-model:is-open="isOpen" />
</template>

<script setup lang="ts">
import {
  LogOut,
  ShoppingCart,
  ShieldUser,
  Frown,
  Gem,
  ArrowRightLeft
} from 'lucide-vue-next'
import CartModal from './CartModal.vue'
import { useSearchHeader } from '../composables/useSearchHeader'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '~/modules/auth/store/authStore'

interface Product {
  id: number
  nameProduct: string
  descriptionProduct: string
  imageUrlProduct: string
  priceProduct: number
  productWeight: string
  quantityProduct: number
  typeProducts: string
}

const authStore = useAuthStore()
const cartStore = useCartStore()
const search = ref<string>('')
const isOpen = defineModel<boolean>('isOpen')
const userRole = defineModel<string>('userRole')
defineEmits(['logOut', 'openCart'])

const { searchProducts } = useSearchHeader()
const isLoading = ref(false)
const isFocused = ref(false)

const handleFocused = () => {
  return setTimeout(() => {
    isFocused.value = false
  }, 200)
}

const products = ref<Product[]>([])

const timeoutId = ref<number | null>(null)

const handleSearch = async (search: string) => {
  isLoading.value = true

  if (search === '') {
    products.value = []
    isLoading.value = false
    return
  }

  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }

  try {
    timeoutId.value = setTimeout(async () => {
      const response = await searchProducts(search)
      console.log(response)
      products.value = response
      isLoading.value = false
    }, 500) as unknown as number
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
