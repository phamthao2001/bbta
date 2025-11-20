import { ref } from 'vue'

export const useOrderFood = () => {
  const orders = ref<Array<{ id: number; name?: string; price?: number; quantity: number }>>([])

  const addToCart = (item: { id: number; name?: string; price?: number }) => {
    const existingItem = orders.value.find((orderItem) => orderItem.id === item.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      orders.value.push({ ...item, quantity: 1 })
    }
  }

  const removeFromCart = (itemId: number) => {
    const itemIndex = orders.value.findIndex((orderItem) => orderItem.id === itemId)
    if (itemIndex !== -1) {
      const item = orders.value[itemIndex]!
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        orders.value = orders.value.filter((_, index) => index !== itemIndex)
      }
    }
  }

  return {
    orders,
    addToCart,
    removeFromCart,
  }
}
