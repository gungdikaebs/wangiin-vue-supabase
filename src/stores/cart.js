import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('wangiin_cart')) || [],
    isOpen: false,
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    cartTotal: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },

  actions: {
    toggleCart() {
      this.isOpen = !this.isOpen
    },
    
    openCart() {
      this.isOpen = true
    },
    
    closeCart() {
      this.isOpen = false
    },

    addItem(product, size, price, quantity = 1) {
      const existingItemIndex = this.items.findIndex(
        item => item.productId === product.id && item.size === size
      )

      if (existingItemIndex !== -1) {
        this.items[existingItemIndex].quantity += quantity
      } else {
        this.items.push({
          productId: product.id,
          name: product.name,
          type: product.type,
          size: size,
          price: price,
          quantity: quantity
        })
      }
      
      this.saveToLocalStorage()
      this.openCart()
    },

    updateQuantity(productId, size, quantity) {
      const item = this.items.find(item => item.productId === productId && item.size === size)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId, size)
        } else {
          item.quantity = quantity
          this.saveToLocalStorage()
        }
      }
    },

    removeItem(productId, size) {
      this.items = this.items.filter(
        item => !(item.productId === productId && item.size === size)
      )
      this.saveToLocalStorage()
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('wangiin_cart', JSON.stringify(this.items))
    }
  }
})
