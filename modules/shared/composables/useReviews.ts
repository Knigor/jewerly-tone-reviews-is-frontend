import type { $Fetch } from 'ofetch'

export const useReviews = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getReviews = async (productId: number) => {
    try {
      const response = await $protectedApi(`reviews/product/${productId}`, {
        method: 'GET'
      })
      console.log(response)
      return response
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error)
    }
  }

  const getAllReviews = async () => {
    try {
      const response = await $protectedApi(`reviews/`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error)
    }
  }

  const addedReview = async (
    product_id: number,
    user_id: number,
    rating: number,
    text: string
  ) => {
    try {
      const response = await $protectedApi(`reviews`, {
        method: 'POST',
        body: {
          productId: product_id,
          textReview: text,
          rating,
          userId: user_id
        }
      })
      return response
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error)
    }
  }

  const moderationReview = async (review_id: number, is_moderate: boolean) => {
    try {
      const response = await $protectedApi(`reviews/${review_id}`, {
        method: 'PUT',
        body: { is_moderate }
      })
      return response
    } catch (error) {
      console.error('Ошибка при модерации отзыва:', error)
    }
  }

  const deleteReview = async (review_id: number) => {
    try {
      const response = await $protectedApi(`reviews/${review_id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error)
    }
  }

  return {
    getReviews,
    addedReview,
    getAllReviews,
    moderationReview,
    deleteReview
  }
}
