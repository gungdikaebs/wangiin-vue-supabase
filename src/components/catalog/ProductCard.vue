<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Format price to IDR
const formattedPrice = computed(() => {
  // Use price_2ml as starting price (lowest)
  const price = props.product.price_2ml || props.product.price || 0
  
  if (typeof price === 'string') return price
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
})
</script>

<template>
  <router-link :to="`/product/${product.id}`" class="product-card group relative bg-transparent hover:bg-brand-surface-lowest border border-transparent hover:border-brand-primary/10 transition-all duration-700 cursor-pointer flex flex-col p-4">
    
    <!-- Image Box Placeholder -->
    <div class="relative h-[420px] bg-brand-surface-lowest w-full flex items-center justify-center p-8 border border-brand-primary/5 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-t from-brand-deep-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
      
      <div class="absolute top-6 left-6 flex gap-2 z-20">
        <span v-if="product.isNew" class="inline-flex px-2 py-1 bg-brand-primary text-brand-on-primary font-mono text-[9px] font-medium tracking-[0.2em] uppercase">
          BARU
        </span>
      </div>
      <div class="absolute top-6 right-6 z-20">
        <!-- UUID hidden -->
      </div>
      
      <!-- Actual Product Image -->
      <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out z-0" />
      
      <!-- Structural Bottle Representation Fallback -->
      <div v-else class="w-24 h-44 border border-brand-primary/20 bg-brand-surface relative group-hover:scale-105 transition-transform duration-[1.5s] ease-out z-0">
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-6 border border-brand-primary/20 bg-brand-surface-bright"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-brand-deep-black/60 to-transparent"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-6 pb-2 flex flex-col flex-grow">
      <span class="font-mono text-[9px] text-brand-secondary tracking-[0.2em] mb-3">{{ product.type }}</span>
      <h3 class="font-display text-xl font-bold uppercase tracking-wide mb-2 group-hover:text-brand-secondary transition-colors duration-500">{{ product.name }}</h3>
      <p class="font-mono text-[10px] text-brand-interface-gray mb-8 flex-grow tracking-[0.1em]">{{ product.subtitle || 'FRAGRANCE NOTES' }}</p>
      
      <div class="flex justify-between items-end mt-auto">
        <span class="font-body text-sm font-light tracking-widest">{{ formattedPrice }}</span>
        <button class="font-mono text-[10px] font-medium tracking-[0.2em] uppercase border-b border-brand-primary/30 pb-1 group-hover:border-brand-secondary group-hover:text-brand-secondary transition-colors duration-500">
          Pilih Ukuran
        </button>
      </div>
    </div>
  </router-link>
</template>
