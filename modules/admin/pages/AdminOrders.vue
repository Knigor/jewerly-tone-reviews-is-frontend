<template>
  <div class="flex flex-col items-center justify-center gap-12 pt-8 pb-8">
    <!-- Поиск -->
    <div class="mr-4 flex w-full max-w-[900px] justify-end gap-2">
      <div class="join">
        <input
          v-model="searchQuery"
          class="input join-item input-xs border-1"
          type="search"
          placeholder="Введите почту или дату"
        />
      </div>

      <select
        v-model="selectedSort"
        class="select select-xs border-1"
        @change="handleSort(selectedSort)"
      >
        <option value="default">Порядок: по умолчанию</option>
        <option value="pending">Порядок: На рассмотрении</option>
        <option value="delete">Порядок: Отклоненные</option>
        <option value="success">Порядок: Одобренные</option>
      </select>
    </div>

    <!-- Отзывы -->

    <div
      class="scrollbar-thumb-gray-600 scrollbar-thin scrollbar-track-gray-300 grid h-[600px] max-w-[900px] gap-4 overflow-auto lg:grid-cols-2"
    >
      <OrdersAdmin
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @update-order="handleUpdateOrder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import OrdersAdmin from '../components/OrdersAdmin.vue'
import { useOrders } from '~/modules/shared/composables/useOrders'
import type { Order } from '~/modules/shared/types/type'

definePageMeta({
  layout: 'custom'
})

const orders = ref<Order[]>()
const allOrders = ref<Order[]>()
const isLoadingOrder = ref(false)
const searchQuery = ref('')
const selectedSort = ref('default')

const { getOrders } = useOrders()

onMounted(async () => {
  isLoadingOrder.value = true
  try {
    const response = await getOrders()
    allOrders.value = response
    orders.value = response
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingOrder.value = false
  }
})

const handleUpdateOrder = async () => {
  isLoadingOrder.value = true
  try {
    const response = await getOrders()
    orders.value = response
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingOrder.value = false
  }
}

const filteredOrders = computed(() => {
  return orders.value?.filter((item) => {
    return (
      item.userEmail.toLowerCase().includes(searchQuery.value) ||
      item.createdAt.toLowerCase().includes(searchQuery.value)
    )
  })
})

const handleSort = async (sort: string) => {
  if (selectedSort.value === 'default') {
    selectedSort.value = sort
    isLoadingOrder.value = true
    try {
      const response = await getOrders()
      orders.value = response
      allOrders.value = response
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingOrder.value = false
    }
  } else if (selectedSort.value === 'success') {
    selectedSort.value = sort
    isLoadingOrder.value = true
    try {
      orders.value = allOrders.value?.filter((item) => {
        return item.status === 'Одобрен'
      })
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingOrder.value = false
    }
  } else if (selectedSort.value === 'pending') {
    selectedSort.value = sort
    isLoadingOrder.value = true
    try {
      orders.value = allOrders.value?.filter((item) => {
        return item.status === 'На рассмотрении'
      })
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingOrder.value = false
    }
  } else if (selectedSort.value === 'delete') {
    selectedSort.value = sort
    isLoadingOrder.value = true
    try {
      orders.value = allOrders.value?.filter((item) => {
        return item.status === 'Отклонён'
      })
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingOrder.value = false
    }
  }
}
</script>

<style scoped></style>
