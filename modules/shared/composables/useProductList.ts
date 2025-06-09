// composables/useProductList.ts
import type { Product, Category } from '~/modules/shared/types/type'
import { useProducts } from './useProducts'
import { useCategory } from '~/modules/main/composables/useCategory'

export const useProductList = () => {
  const cardsProduct = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const isLoadingProducts = ref(false)
  const selectedCategory = ref('')
  const searchProducts = ref('')
  const selectedSort = ref('DEFAULT')

  const minRating = ref<number | null>(null)
  const minTone = ref<number | null>(null)

  const {
    getProducts,
    getProductByCategory,
    getProductsSort,
    getProductsByRatingAndTone
  } = useProducts()
  const { getCategories } = useCategory()

  const fetchInitialData = async () => {
    isLoadingProducts.value = true
    try {
      await Promise.all([getCategories(), getProducts()]).then(
        ([category, products]) => {
          console.log(category, products)
          categories.value = category
          cardsProduct.value = products
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingProducts.value = false
    }
  }

  const handleFilterByRatingAndTone = async () => {
    if (minRating.value === null && minTone.value === null) {
      // Если фильтры не заданы, подгружаем все продукты
      return handleReset()
    }

    isLoadingProducts.value = true
    try {
      // Если один из фильтров null — можно подставить 0 или игнорировать
      const rating = minRating.value ?? 0
      const tone = minTone.value ?? 0

      const response = await getProductsByRatingAndTone(rating, tone)
      cardsProduct.value = response
    } catch (error) {
      console.error(
        'Ошибка при фильтрации продуктов по рейтингу и тональности:',
        error
      )
    } finally {
      isLoadingProducts.value = false
    }
  }

  const handleReset = async () => {
    selectedCategory.value = ''
    isLoadingProducts.value = true
    try {
      const response = await getProducts()
      cardsProduct.value = response
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingProducts.value = false
    }
  }

  const handleCategoryFilter = async (category: Category) => {
    selectedCategory.value = category.nameCategory
    isLoadingProducts.value = true
    searchProducts.value = ''
    try {
      const response = await getProductByCategory(category.id)
      cardsProduct.value = response
    } catch (error) {
      console.error(error)
    } finally {
      isLoadingProducts.value = false
    }
  }

  const handleSort = async (sort: string) => {
    if (selectedSort.value === 'DEFAULT') {
      selectedSort.value = sort
      isLoadingProducts.value = true
      try {
        const response = await getProducts()
        cardsProduct.value = response
      } catch (error) {
        console.error(error)
      } finally {
        isLoadingProducts.value = false
      }
    } else {
      selectedSort.value = sort
      isLoadingProducts.value = true
      try {
        const response = await getProductsSort(sort)
        cardsProduct.value = response
      } catch (error) {
        console.error(error)
      } finally {
        isLoadingProducts.value = false
      }
    }
  }

  const filteredProducts = computed(() => {
    return cardsProduct.value.filter((item) =>
      item.nameProduct
        .toLowerCase()
        .includes(searchProducts.value.toLowerCase())
    )
  })

  const truncate = (text: string, length = 50) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  return {
    cardsProduct,
    categories,
    isLoadingProducts,
    selectedCategory,
    searchProducts,
    selectedSort,
    filteredProducts,
    minRating,
    minTone,
    fetchInitialData,
    handleReset,
    handleCategoryFilter,
    handleSort,
    truncate,
    handleFilterByRatingAndTone
  }
}
