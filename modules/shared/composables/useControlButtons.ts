export const useControllButtons = (
  onQuantityChange?: (newQuantity: number) => void
) => {
  const quantity = ref(1)
  const priceProduct = ref(5160)

  const updatePrice = () => {
    priceProduct.value = quantity.value * 5160
  }

  const handlePlus = () => {
    if (quantity.value < 99) {
      quantity.value++
      updatePrice()
      onQuantityChange?.(quantity.value) // Прокидываем новое значение
    }
  }

  const handleMinus = () => {
    if (quantity.value > 1) {
      quantity.value--
      updatePrice()
      onQuantityChange?.(quantity.value) // Прокидываем новое значение
    }
  }

  const handleInput = (e: Event) => {
    const inputValue = parseInt((e.target as HTMLInputElement).value)
    if (!isNaN(inputValue)) {
      quantity.value = Math.min(99, Math.max(1, inputValue))
      updatePrice()
      onQuantityChange?.(quantity.value) // Прокидываем новое значение
    }
  }

  return {
    handlePlus,
    handleMinus,
    handleInput,
    quantity,
    priceProduct
  }
}
