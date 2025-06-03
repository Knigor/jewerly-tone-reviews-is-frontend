<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="closeModal">
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
              tabindex="0"
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg leading-6 font-medium text-gray-900"
              >
                Удалить продукт {{ cardProduct.nameProduct }}
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Вы уверены, что хотите удалить продукт?
                </p>
              </div>

              <div class="mt-4 flex gap-4">
                <button class="btn btn-error" @click="deleteProduct">
                  Удалить
                </button>
                <button class="btn btn-info" @click="closeModal">
                  Отменить
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
import type { Product } from '~/modules/shared/types/type'

const props = defineProps<{
  isOpen: boolean
  cardProduct: Product
}>()

console.log('Дочерний удаление', props.cardProduct)

const emit = defineEmits<{
  (e: 'closeModal'): void
  (e: 'deleteProduct', id: number): void
}>()

function deleteProduct() {
  emit('deleteProduct', props.cardProduct.id)
}

function closeModal() {
  emit('closeModal')
}
</script>
