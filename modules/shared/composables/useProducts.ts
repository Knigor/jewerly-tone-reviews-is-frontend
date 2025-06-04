import type { $Fetch } from 'ofetch'
import type { Product, AddedProduct } from '../types/type'
import { useAuthStore } from '~/modules/auth/store/authStore'

export const useProducts = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }
  const authStore = useAuthStore()

  const getProductById = async (id: number) => {
    try {
      const response = await $protectedApi(`products/${id}`, { method: 'GET' })
      return response
    } catch (error) {
      console.error('Ошибка при получении продуктов:', error)
    }
  }

  const getProducts = async (): Promise<Product[]> => {
    try {
      const response = await $protectedApi('products', { method: 'GET' })
      return response
    } catch (error) {
      console.error('Ошибка при получении продуктов:', error)
      return []
    }
  }

  const getProductByCategory = async (
    categoryId: number
  ): Promise<Product[]> => {
    try {
      const response = await $protectedApi(`products?category=${categoryId}`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      console.error('Ошибка при получении продуктов:', error)
      return []
    }
  }

  const getProductsSort = async (sort: string): Promise<Product[]> => {
    try {
      const response = await $protectedApi(`products?order=${sort}`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      console.error('Ошибка при получении продуктов:', error)
      return []
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      const response = await $protectedApi(`products/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error)
    }
  }

  const addedProduct = async (product: AddedProduct) => {
    Object.assign(product, { user_id: authStore.user?.id })

    try {
      const response = await $protectedApi('products', {
        method: 'POST',
        body: JSON.stringify(product) || product
      })
      return response
    } catch (error) {
      console.error('Ошибка при добавлении продукта:', error)
    }
  }

  const updateProduct = async (product: AddedProduct, id: number) => {
    Object.assign(product, { user_id: authStore.user?.id })

    try {
      const response = await $protectedApi(`products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product) || product
      })
      return response
    } catch (error) {
      console.error('Ошибка при обновлении продукта:', error)
    }
  }

  return {
    getProductById,
    updateProduct,
    addedProduct,
    getProducts,
    getProductByCategory,
    getProductsSort,
    deleteProduct
  }
}
