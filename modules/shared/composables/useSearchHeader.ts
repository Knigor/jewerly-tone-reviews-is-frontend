import type { $Fetch } from 'ofetch'

export const useSearchHeader = () => {
  interface Product {
    id: number
    nameProduct: string
    descriptionProduct: string
    imageUrlProduct: string
    priceProduct: number
    productWeight: string
    quantityProduct: number
    typeProducts: string
  }

  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      const rawResponse = await $protectedApi(`products?search=${query}`, {
        method: 'GET'
      })
      console.log('RAW:', rawResponse)
      return rawResponse
    } catch (error) {
      console.log('Ошибка при поиске продуктов', error)
      return []
    }
  }

  return { searchProducts }
}
