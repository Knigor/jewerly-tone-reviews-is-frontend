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
                Редактирование товара {{ product.nameProduct }}
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Отредактируйте поля</p>
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
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700">
                    Размеры (можно выбрать несколько)
                  </label>
                  <div class="grid grid-cols-4 gap-2">
                    <label
                      v-for="size in [14, 15, 16, 17, 18, 19, 20]"
                      :key="size"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="sizeProduct"
                        type="checkbox"
                        :value="size"
                        class="checkbox checkbox-primary border-1"
                      />
                      {{ size }}
                    </label>
                  </div>
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
                      {{ category.nameCategory }}
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
                    Описание метала
                  </label>
                  <input
                    v-model="metal"
                    type="text"
                    placeholder="Платина"
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
                    Обновить
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
import type { Category, Product } from '~/modules/shared/types/type'

const props = defineProps<{
  isOpen: boolean
  categories: Category[]
  product: Product
}>()

const nameProduct = ref(props.product.nameProduct)
const descriptionProduct = ref(props.product.descriptionProduct)
const priceProduct = ref(props.product.priceProduct)
const metal = ref(props.product.metal)
const imageUrl = ref(props.product.imgUrlProduct)
const selectedCategory = ref(props.product.category.id)
const sizeProduct = ref<number[]>([...props.product.sizeProduct])

watch(
  () => props.product,
  (newProduct) => {
    nameProduct.value = newProduct.nameProduct
    descriptionProduct.value = newProduct.descriptionProduct
    priceProduct.value = newProduct.priceProduct
    imageUrl.value = newProduct.imgUrlProduct
    selectedCategory.value = newProduct.category.id
    sizeProduct.value = [...newProduct.sizeProduct]
    metal.value = newProduct.metal
  }
)

const emit = defineEmits<{
  (e: 'closeModal'): void
  (
    e: 'addedProduct',
    productData: {
      name: string
      description: string
      price: number
      img_url: string
      category_id: number
      size: number[]
      metal: string
    },
    id: number
  ): void
}>()

function addedProduct() {
  emit(
    'addedProduct',
    {
      name: nameProduct.value,
      description: descriptionProduct.value,
      price: Number(priceProduct.value),
      img_url: imageUrl.value,
      category_id: Number(selectedCategory.value),
      size: sizeProduct.value,
      metal: metal.value
    },
    props.product.id
  )
}

function closeModal() {
  emit('closeModal')
}
</script>
