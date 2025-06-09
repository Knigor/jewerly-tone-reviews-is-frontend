<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog class="relative z-10" as="div" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="relative w-full max-w-[800px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <button
                class="btn btn-square btn-ghost absolute top-2 right-4"
                @click="closeModal"
              >
                <X stroke-width="1" />
              </button>
              <DialogTitle
                as="h3"
                class="text-lg leading-6 font-medium text-gray-900"
              >
                Оформление заказа
              </DialogTitle>

              <hr class="mt-4" />
              <div class="mt-2 mb-2 flex flex-col gap-4">
                <!-- Карточки товаров в корзине -->
                <p v-if="cartStore.isEmpty" class="py-12 text-center text-2xl">
                  Сейчас здесь пусто. Добавьте товар в корзину
                </p>

                <ul
                  v-for="item in cartStore.items"
                  :key="item.productId"
                  class="list bg-base-100 rounded-box shadow-md"
                >
                  <li class="list-row items-center">
                    <div>
                      <img class="rounded-box size-25" :src="item.imgUrl" />
                    </div>
                    <div>
                      <div class="mt-1">{{ item.name }}</div>
                    </div>

                    <ControllButtonsCart
                      v-model:quantity="item.quantity"
                      :product-id="item.productId"
                    />
                    <p class="inline-block w-24 text-end text-gray-600">
                      {{
                        new Intl.NumberFormat('ru-RU').format(
                          item.price * item.quantity
                        )
                      }}
                      р.
                    </p>

                    <button
                      class="btn btn-square btn-ghost"
                      @click="handleDeleteItem(item.productId)"
                    >
                      <X stroke-width="1" />
                    </button>
                  </li>
                </ul>
              </div>

              <hr class="" />

              <p class="mt-4 mb-4 text-end">
                Сумма:
                <span>{{
                  new Intl.NumberFormat('ru-RU').format(cartStore.totalPrice)
                }}</span>
                р.
              </p>

              <hr class="" />

              <div class="mt-2">
                <h3 class="text-lg font-semibold">Контактная информация</h3>
                <div class="mt-2">
                  <p class="text-primary text-[16px]">
                    Имя:
                    <span class="text-gray-500">{{
                      authStore.user?.name
                    }}</span>
                  </p>
                  <p class="text-primary text-[16px]">
                    Почта:
                    <span class="text-gray-500">{{
                      authStore.user?.email
                    }}</span>
                  </p>
                  <!-- <p class="text-primary text-[16px]">
                    Телефон:
                    <span class="text-gray-500">{{
                      authStore.user?.phone
                    }}</span>
                  </p> -->
                </div>
              </div>

              <div class="mt-4">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  :disabled="cartStore.isEmpty"
                  @click="handleAddedOrder"
                >
                  Оформить заказ
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { useAuthStore } from '~/modules/auth/store/authStore'
import { X } from 'lucide-vue-next'
import ControllButtonsCart from './ControllButtonsCart.vue'
import { useCartStore } from '../store/cartStore'
import { useOrders } from '../composables/useOrders'

interface CartItem {
  productId: number
  quantity: number
  price: number
  name: string
  imgUrl: string
}

interface CartState {
  items: CartItem[] | null
}

const cartStore = useCartStore()
const authStore = useAuthStore()
const { addedOrder } = useOrders()
const { $toast } = useNuxtApp()

const isOpen = defineModel<boolean>('isOpen')
function closeModal() {
  isOpen.value = false
}

function handleDeleteItem(id: number) {
  cartStore.removeItem(id)
}

async function handleAddedOrder() {
  if (cartStore.items === null) return
  try {
    const cartStates: CartState[] = [{ items: cartStore.items }]
    await addedOrder(authStore.user!.id, authStore.user!.email, cartStates)
    cartStore.clearCart()
    isOpen.value = false
    $toast.success(
      'Заказ успешно оформлен, ожидайте когда с вами свяжется администратор'
    )
  } catch (error) {
    console.log(error)
  }
}
</script>
