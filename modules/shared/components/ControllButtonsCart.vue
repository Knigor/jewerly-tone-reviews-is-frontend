<template>
  <div class="flex items-center gap-1">
    <button class="btn btn-square btn-ghost" @click="handleDecrement">
      <Minus stroke-width="1" />
    </button>

    <input
      v-model="localQuantity"
      type="text"
      min="1"
      max="99"
      class="input input-neutral flex h-8 w-8 items-center justify-center p-1"
      @input="handleInputChange"
    />

    <button class="btn btn-square btn-ghost" @click="handleIncrement">
      <Plus stroke-width="1" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'
import { useCartStore } from '../store/cartStore'

const props = defineProps<{
  productId: number
  quantity: number
}>()

const emit = defineEmits<{
  (e: 'update:quantity', value: number): void
}>()

const cartStore = useCartStore()
const localQuantity = ref(props.quantity)

// Синхронизация при изменении props
watch(
  () => props.quantity,
  (newVal) => {
    localQuantity.value = newVal
  }
)

const updateQuantity = (newQuantity: number) => {
  // Обновляем локальное значение
  localQuantity.value = newQuantity
  // Отправляем событие родителю
  emit('update:quantity', newQuantity)
  // Обновляем в хранилище
  cartStore.updateQuantity(props.productId, newQuantity)
}

const handleIncrement = () => {
  updateQuantity(localQuantity.value + 1)
}

const handleDecrement = () => {
  if (localQuantity.value > 1) {
    updateQuantity(localQuantity.value - 1)
  }
}

const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const inputValue = parseInt(target.value)

  if (!isNaN(inputValue)) {
    updateQuantity(inputValue)
  } else {
    updateQuantity(1)
  }
}
</script>
