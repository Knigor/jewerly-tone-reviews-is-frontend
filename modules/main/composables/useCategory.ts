import type { $Fetch } from 'ofetch'

export const useCategory = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getCategories = async () => {
    try {
      const response = await $protectedApi('categories', { method: 'GET' })
      return response
    } catch (error) {
      console.error('Ошибка при получении категорий:', error)
      return []
    }
  }

  return { getCategories }
}
