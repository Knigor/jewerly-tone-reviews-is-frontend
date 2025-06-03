<template>
  <div class="mr-6 space-y-6">
    <div class="rounded-xl border p-4 shadow-md">
      <div
        class="mb-2 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div class="flex flex-wrap items-center gap-4">
            <h2 class="text-lg font-bold">Заказ №{{ order.id }}</h2>
            <div
              v-if="order.status === 'Одобрен'"
              class="badge badge-success p-2"
            >
              <svg
                class="size-[1em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  fill="currentColor"
                  stroke-linejoin="miter"
                  stroke-linecap="butt"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="square"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></circle>
                  <polyline
                    points="7 13 10 16 17 8"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="square"
                    stroke-miterlimit="10"
                    stroke-width="2"
                  ></polyline>
                </g>
              </svg>
              Одобрен
            </div>

            <div
              v-if="order.status === 'На рассмотрении'"
              class="badge badge-warning p-2"
            >
              <svg
                class="size-[1em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
              >
                <g fill="currentColor">
                  <path
                    d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  ></path>
                  <line
                    x1="9"
                    y1="6.5"
                    x2="9"
                    y2="10"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  ></line>
                  <path
                    d="M9,13.569c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                    fill="currentColor"
                    data-stroke="none"
                    stroke="none"
                  ></path>
                </g>
              </svg>
              На рассмотрении
            </div>

            <div
              v-if="order.status === 'Отклонён'"
              class="badge badge-error p-2"
            >
              <svg
                class="size-[1em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g fill="currentColor">
                  <rect
                    x="1.972"
                    y="11"
                    width="20.056"
                    height="2"
                    transform="translate(-4.971 12) rotate(-45)"
                    fill="currentColor"
                    stroke-width="0"
                  ></rect>
                  <path
                    d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z"
                    stroke-width="0"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
              Отклонён
            </div>
          </div>

          <p class="text-sm text-gray-600">Создан: {{ order.createdAt }}</p>
          <p class="text-sm text-gray-600">
            Пользователь: {{ order.userName }} ({{ order.userEmail }})
          </p>
          <p class="text-sm text-gray-600">Телефон: {{ order.phone }}</p>
        </div>
      </div>

      <div class="border-t pt-2">
        <h3 class="mb-1 text-sm font-semibold">Товары:</h3>
        <ul class="space-y-1">
          <li
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span
              >{{ item.productName }} ({{ item.quantity }} ×
              {{ item.price }}₽)</span
            >
            <span class="font-medium">{{ item.total }}₽</span>
          </li>
        </ul>
      </div>

      <div class="border-t pt-2 text-right text-sm font-semibold">
        Итого: {{ order.totalQuantity }} шт. / {{ order.totalAmount }}₽
      </div>

      <div
        class="flex items-center justify-end gap-4 border-t pt-2 text-right text-sm font-semibold"
      >
        <button
          v-if="order.status !== 'Одобрен'"
          class="btn btn-success btn-xs"
          @click="handleUpdateOrder(order.id, 'Одобрен')"
        >
          Одобрить
        </button>
        <button
          v-if="order.status !== 'Отклонён'"
          class="btn btn-warning btn-xs"
          @click="handleUpdateOrder(order.id, 'Отклонён')"
        >
          Отклонить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/modules/shared/types/type'
import { useOrders } from '~/modules/shared/composables/useOrders'

defineProps<{
  order: Order
}>()

const emit = defineEmits(['updateOrder'])

const { updateOrder } = useOrders()

const handleUpdateOrder = async (id: number, status: string) => {
  try {
    await updateOrder(id, status)
    emit('updateOrder')
  } catch (error) {
    console.error(error)
  }
}

// если понадобиться удалять отзывы

// const handleDeleteOrder = async (id: number) => {
//   try {
//     await deleteOrder(id)
//     emit('updateOrder')
//   } catch (error) {
//     console.error(error)
//   }
// }
</script>
