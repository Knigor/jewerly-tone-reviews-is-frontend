<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg leading-6 font-medium text-gray-900"
              >
                <button
                  class="btn btn-square btn-ghost absolute top-2 right-4"
                  @click="closeModal"
                >
                  <X stroke-width="1" />
                </button>
                Добавить товар
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Дбоавление товара</p>
              </div>

              <form class="mt-4 space-y-4" @submit.prevent>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Название продукта
                  </label>
                  <input
                    v-model="nameProduct"
                    type="text"
                    placeholder="Название продукта"
                    class="input input-primary mt-2 border"
                  />
                </div>

                <!-- Категория из селекта -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Категория
                  </label>
                  <select
                    v-model="selectedCategory"
                    class="select select-primary mt-2 border"
                  >
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Описание продукта
                  </label>
                  <textarea
                    v-model="descriptionProduct"
                    type="text"
                    placeholder="Описание продукта"
                    class="textarea textarea-primary mt-2 max-h-12 border"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Цена
                  </label>
                  <input
                    v-model="priceProduct"
                    type="text"
                    placeholder="Цена"
                    class="input input-primary mt-2 border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Тип продукта
                  </label>
                  <input
                    v-model="typeProducts"
                    type="text"
                    placeholder="Охлажденная"
                    class="input input-primary mt-2 border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Вес продукта
                  </label>
                  <input
                    v-model="productWeight"
                    type="text"
                    placeholder="50 г"
                    class="input input-primary mt-2 border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Кол-во товара на складе
                  </label>
                  <input
                    v-model="quantityProduct"
                    type="text"
                    placeholder="23"
                    class="input input-primary mt-2 border"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Вставьте ссылку на картинку
                  </label>
                  <input
                    v-model="imageUrl"
                    type="text"
                    placeholder="http://aboba.ru"
                    class="input input-primary mt-2 border"
                  />
                </div>

                <div class="mt-4 flex gap-4">
                  <button class="btn btn-accent" @click="addedProduct">
                    Добавить
                  </button>
                  <button class="btn btn-info" @click="closeModal">
                    Отменить
                  </button>
                </div>
              </form>
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
import { X } from 'lucide-vue-next'
import type { Category } from '~/modules/shared/types/type'

defineProps<{
  isOpen: boolean
  categories: Category[]
}>()

const nameProduct = ref('')
const descriptionProduct = ref('')
const priceProduct = ref()
const typeProducts = ref('')
const productWeight = ref('100 г')
const quantityProduct = ref()
const imageUrl = ref('')
const selectedCategory = ref(1)

const emit = defineEmits<{
  (e: 'closeModal'): void
  (
    e: 'addedProduct',
    productData: {
      nameProduct: string
      descriptionProduct: string
      priceProduct: number
      typeProducts: string
      productWeight: string
      quantityProduct: number
      imageUrl: string
      categoryId: number
    }
  ): void
}>()

function addedProduct() {
  emit('addedProduct', {
    nameProduct: nameProduct.value,
    descriptionProduct: descriptionProduct.value,
    priceProduct: Number(priceProduct.value),
    typeProducts: typeProducts.value,
    productWeight: productWeight.value,
    quantityProduct: Number(quantityProduct.value),
    imageUrl: imageUrl.value,
    categoryId: Number(selectedCategory.value)
  })
}

function closeModal() {
  emit('closeModal')
}
</script>
