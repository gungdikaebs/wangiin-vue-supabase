<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formattedTotal = computed(() => formatPrice(cartStore.cartTotal))

const checkout = () => {
  cartStore.closeCart()
  router.push('/checkout')
}
</script>

<template>
  <div v-if="cartStore.isOpen" class="fixed inset-0 z-[100] flex justify-end">
    <!-- Backdrop -->
    <div 
      @click="cartStore.closeCart" 
      class="absolute inset-0 bg-brand-deep-black/60 backdrop-blur-sm transition-opacity"
    ></div>

    <!-- Drawer -->
    <div class="relative w-full max-w-md bg-brand-surface-lowest h-full flex flex-col border-l border-brand-primary/10 shadow-2xl animate-slide-left">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-brand-primary/10 bg-brand-surface">
        <div class="flex items-center gap-3">
          <ShoppingBag class="w-5 h-5 text-brand-primary" />
          <h2 class="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-brand-primary">Keranjang Belanja</h2>
          <span class="bg-brand-secondary text-brand-on-secondary text-[9px] font-mono px-2 py-0.5 rounded-full">
            {{ cartStore.totalItems }}
          </span>
        </div>
        <button @click="cartStore.closeCart" class="p-2 text-brand-interface-gray hover:text-brand-secondary transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="cartStore.items.length === 0" class="flex-grow flex flex-col items-center justify-center p-8 text-center opacity-70">
        <ShoppingBag class="w-12 h-12 text-brand-primary/40 mb-4" />
        <h3 class="font-display text-xl uppercase tracking-widest text-brand-primary mb-2">Keranjang Kosong</h3>
        <p class="font-body text-sm text-brand-on-surface-variant mb-6">Belum ada mahakarya wewangian yang Anda pilih.</p>
        <button @click="cartStore.closeCart" class="font-mono text-[10px] tracking-widest uppercase border-b border-brand-secondary text-brand-secondary pb-1">
          Eksplorasi Koleksi
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
        <div v-for="item in cartStore.items" :key="`${item.productId}-${item.size}`" class="flex gap-4 border border-brand-primary/10 p-4 bg-brand-surface/30 group hover:border-brand-primary/30 transition-colors">
          
          <!-- Mini Product Visual -->
          <div class="w-20 h-24 bg-brand-deep-black border border-brand-primary/5 flex items-center justify-center relative overflow-hidden flex-shrink-0">
            <div class="w-8 h-12 border border-brand-primary/20 bg-brand-surface"></div>
          </div>

          <!-- Item Details -->
          <div class="flex-grow flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-1">
                <span class="font-mono text-[8px] text-brand-secondary tracking-[0.2em] uppercase">{{ item.type }}</span>
                <button @click="cartStore.removeItem(item.productId, item.size)" class="text-brand-primary/30 hover:text-red-400 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <h4 class="font-display text-sm font-bold uppercase tracking-wide text-brand-primary line-clamp-1">{{ item.name }}</h4>
              <span class="font-mono text-[10px] text-brand-interface-gray tracking-widest block mt-1">VOL: {{ item.size }}</span>
            </div>
            
            <div class="flex justify-between items-end mt-4">
              <span class="font-body text-sm font-light text-brand-primary">{{ formatPrice(item.price * item.quantity) }}</span>
              
              <!-- Quantity Control -->
              <div class="flex items-center border border-brand-primary/20 h-8">
                <button @click="cartStore.updateQuantity(item.productId, item.size, item.quantity - 1)" class="w-8 h-full flex items-center justify-center text-brand-primary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-colors">
                  <Minus class="w-3 h-3" />
                </button>
                <span class="w-8 text-center font-mono text-[10px] font-semibold">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.productId, item.size, item.quantity + 1)" class="w-8 h-full flex items-center justify-center text-brand-primary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-colors">
                  <Plus class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer / Checkout -->
      <div v-if="cartStore.items.length > 0" class="border-t border-brand-primary/10 p-6 bg-brand-surface">
        <div class="flex justify-between items-center mb-6">
          <span class="font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray">Subtotal</span>
          <span class="font-display text-xl font-bold tracking-wider text-brand-primary">{{ formattedTotal }}</span>
        </div>
        <p class="font-body text-xs text-brand-on-surface-variant mb-6 text-center opacity-70">Pengiriman dan pajak dihitung saat checkout.</p>
        <button @click="checkout" class="w-full inline-flex items-center justify-center font-body text-xs md:text-sm font-semibold uppercase tracking-wider h-14 bg-brand-primary text-brand-on-primary hover:bg-brand-secondary hover:text-brand-on-secondary transition-colors duration-300">
          Lanjut ke Checkout
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-slide-left {
  animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
