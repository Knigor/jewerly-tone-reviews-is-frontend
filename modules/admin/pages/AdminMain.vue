<template>
  <div class="flex flex-col items-center justify-center gap-12 pt-8 pb-8">
    <!-- Фильтры по категориям -->

    <!-- Поиск -->
    <div class="mr-4 flex w-full max-w-[900px] justify-end gap-2">
      <div class="join">
        <input
          v-model="searchProducts"
          class="input join-item input-xs border-1"
          type="search"
          placeholder="Поиск"
        />
      </div>

      <select
        v-model="selectedSort"
        class="select select-xs border-1"
        @change="handleSort(selectedSort)"
      >
        <option value="DEFAULT">Порядок: по умолчанию</option>
        <option value="price_asc">Цена: По возрастанию</option>
        <option value="price_desc">Цена: По убыванию</option>
      </select>
    </div>

    <div class="mr-4 flex w-full max-w-[900px] justify-end gap-4">
      <p class="link link-accent underline-offset-4" @click="openAddedModal">
        Добавить
      </p>
      <p
        class="link link-primary underline-offset-4"
        @click="navigateTo('/admin-reviews')"
      >
        Отзывы
      </p>
    </div>

    <!-- Карточки товара -->
    <div
      class="mx-auto grid max-w-[900px] grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="card in filteredProducts"
        :key="card.id"
        class="card w-full border-blue-600 shadow-sm"
      >
        <figure class="">
          <img
            :src="card.imgUrlProduct"
            alt="Shoes"
            class="rounded-xl rounded-b-none"
          />
        </figure>
        <div class="card-body rounded-t-none">
          <h2 class="card-title">
            {{ card.nameProduct }}
            <div class="badge badge-secondary p-2">
              {{ new Intl.NumberFormat('ru-RU').format(card.priceProduct) }}р
            </div>
          </h2>
          <p>
            {{ truncate(card.descriptionProduct) }}
          </p>

          <div class="flex gap-2">
            <button class="btn btn-secondary" @click="openDeleteModal(card)">
              Удалить
            </button>

            <button
              class="btn btn-warning max-w-[130px]"
              :disabled="loadingStates[card.id]"
              @click="openUpdateModal(card)"
            >
              <span
                v-if="loadingStates[card.id]"
                class="loading text-primary loading-spinner"
              ></span>
              <span v-else>Редактировать</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Модалка на удаление -->

      <!-- Модалка на редактирование -->
      <UpdateModal
        v-if="currentCardName"
        :product="currentCardName"
        :categories="categories"
        :is-open="isOpenUpdate"
        @close-modal="isOpenUpdate = false"
        @added-product="handleUpdateProduct"
      />

      <!-- Модалка на добавление -->

      <AddedModal
        :is-open="isOpenAdded"
        :categories="categories"
        @close-modal="isOpenAdded = false"
        @added-product="handleAddedProduct"
      />

      <!-- Удаление компонента -->
      <DeleteModal
        v-if="currentCardName"
        :card-product="currentCardName"
        :is-open="isOpenDelete"
        @close-modal="isOpenDelete = false"
        @delete-product="handleDeleteProduct"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DeleteModal from '../components/DeleteModal.vue'
import UpdateModal from '../components/UpdateModal.vue'
import AddedModal from '../components/AddedModal.vue'
import { useProducts } from '~/modules/shared/composables/useProducts'
import { useProductList } from '~/modules/shared/composables/useProductList'
import type { Product, AddedProduct } from '~/modules/shared/types/type'

const { getProductById, deleteProduct, addedProduct, updateProduct } =
  useProducts()
const {
  categories,
  searchProducts,
  selectedSort,
  filteredProducts,
  fetchInitialData,
  handleSort,
  truncate
} = useProductList()

onMounted(() => {
  fetchInitialData()
})

definePageMeta({
  layout: 'custom'
})

const loadingStates = ref<Record<number, boolean>>({})

const isOpenDelete = ref(false)
const currentCardName = ref<Product>()

const isOpenUpdate = ref(false)

const isOpenAdded = ref(false)

function openDeleteModal(card: Product) {
  isOpenDelete.value = true
  currentCardName.value = card
}

async function openUpdateModal(card: Product) {
  try {
    loadingStates.value[card.id] = true
    const response = await getProductById(card.id)
    currentCardName.value = response
    isOpenUpdate.value = true
    console.log(response)
  } catch (error) {
    console.error(error)
  } finally {
    loadingStates.value[card.id] = false
  }
}

async function handleDeleteProduct(id: number) {
  await Promise.all([deleteProduct(id), fetchInitialData()])
  isOpenDelete.value = false
}

async function handleUpdateProduct(productData: AddedProduct, id: number) {
  await Promise.all([updateProduct(productData, id), fetchInitialData()])
  isOpenUpdate.value = false
}

async function handleAddedProduct(productData: AddedProduct) {
  await Promise.all([addedProduct(productData), fetchInitialData()])
  isOpenAdded.value = false
}

function openAddedModal() {
  isOpenAdded.value = true
}
</script>

<style scoped></style>
