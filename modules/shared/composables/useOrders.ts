import type { $Fetch } from 'ofetch'
interface CartItem {
  productId: number
  quantity: number
  price: number
  name: string
  imgUrl: string
}

interface CartState {
  items: CartItem[] | null
}

export const useOrders = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getOrders = async () => {
    try {
      const response = await $protectedApi('orders/', { method: 'GET' })
      return response
    } catch (error) {
      console.error('Ошибка при получении заказов:', error)
      return []
    }
  }

  const deleteOrder = async (id: number) => {
    try {
      const response = await $protectedApi(`orders/items/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      console.error('Ошибка при удалении заказа:', error)
    }
  }

  const updateOrder = async (id: number, status: string) => {
    try {
      const response = await $protectedApi(`orders/${id}/status`, {
        method: 'PATCH',
        body: { status }
      })
      return response
    } catch (error) {
      console.error('Ошибка при обновлении заказа:', error)
    }
  }

  const addedOrder = async (
    userId: number,
    phone: string,
    cartStates: CartState[]
  ) => {
    // достаем productId и quantity
    const items = cartStates.flatMap(
      (cartState) =>
        cartState.items?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })) || []
    )

    const order = { userId, phoneOrder: phone, items }

    try {
      const response = await $protectedApi('orders/', {
        method: 'POST',
        body: JSON.stringify(order) || order
      })
      return response
    } catch (error) {
      console.error('Ошибка при добавлении заказа:', error)
    }
  }

  return { getOrders, deleteOrder, updateOrder, addedOrder }
}
