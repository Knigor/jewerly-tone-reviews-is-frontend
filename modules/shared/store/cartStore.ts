// stores/cart.js
import { defineStore } from 'pinia'

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

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: null
  }),
  actions: {
    addItem(
      productId: number,
      quantity: number,
      price: number,
      name: string,
      imgUrl: string
    ) {
      if (this.items === null) {
        this.items = []
      }

      const existingItem = this.items.find(
        (item) => item.productId === productId
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ productId, quantity, price, name, imgUrl })
      }
    },

    // Удаление товара из корзины
    removeItem(productId: number) {
      if (this.items === null) return
      this.items = this.items.filter((item) => item.productId !== productId)
    },

    // Изменение количества товара
    updateQuantity(productId: number, newQuantity: number) {
      if (this.items === null) return
      const item = this.items.find((item) => item.productId === productId)
      if (item) {
        item.quantity = newQuantity
      }
    },

    // Очистка корзины
    clearCart() {
      this.items = []
    }
  },
  getters: {
    // Получение общего количества товаров в корзине
    totalItems: (state) => {
      return state.items?.reduce((total, item) => total + item.quantity, 0) || 0
    },

    // получаем сумму

    totalPrice: (state) => {
      if (!state.items) return 0
      return state.items?.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    },

    // Проверка, есть ли товар в корзине
    isInCart: (state) => (productId: number) => {
      return state.items?.some((item) => item.productId === productId) || false
    },
    // проверка на пустоту
    isEmpty: (state) => state.items?.length === 0 || state.items === null
  }
})
