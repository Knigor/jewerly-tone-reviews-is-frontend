<template>
  <div class="flex items-center gap-1">
    <button class="btn btn-square btn-ghost" @click="handleMinus">
      <Minus stroke-width="1" />
    </button>

    <input
      v-model="quantity"
      class="input input-neutral flex h-8 w-8 items-center justify-center p-1"
      @input="handleInput"
    />

    <button class="btn btn-square btn-ghost" @click="handlePlus">
      <Plus stroke-width="1" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'
import { useControllButtons } from '../composables/useControlButtons'

const emit = defineEmits<{
  (e: 'update:quantity', value: number): void
}>()

const { handlePlus, handleMinus, handleInput, quantity } = useControllButtons(
  (newValue: number) => {
    emit('update:quantity', newValue)
  }
)
</script>

<style scoped></style>
