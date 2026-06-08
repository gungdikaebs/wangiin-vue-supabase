<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useProductStore } from '../../stores/product'
import { useCartStore } from '../../stores/cart'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-vue-next'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const quantity = ref(1)
const selectedSize = ref('5ml')

const sizes = [
  { id: '2ml', label: '2 ML', prop: 'price_2ml' },
  { id: '5ml', label: '5 ML', prop: 'price_5ml' },
  { id: '10ml', label: '10 ML', prop: 'price_10ml' }
]

onMounted(async () => {
  await productStore.fetchProductById(route.params.id)
})

useHead({
  title: computed(() => productStore.currentProduct ? `${productStore.currentProduct.name} | Wangiin` : 'Memuat... | Wangiin')
})

const currentPrice = computed(() => {
  if (!productStore.currentProduct) return 0
  const sizeObj = sizes.find(s => s.id === selectedSize.value)
  return productStore.currentProduct[sizeObj.prop]
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(currentPrice.value)
})

const totalPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(currentPrice.value * quantity.value)
})

const increment = () => { quantity.value++ }
const decrement = () => { if (quantity.value > 1) quantity.value-- }

const addToCart = () => {
  if (!productStore.currentProduct) return
  
  cartStore.addItem(
    productStore.currentProduct, 
    selectedSize.value, 
    currentPrice.value, 
    quantity.value
  )
  
  // Reset quantity after adding
  quantity.value = 1
}
</script>

<template>
  <div class="min-h-screen pt-12 pb-32">
    <!-- Loading State -->
    <div v-if="productStore.loading" class="flex flex-col items-center justify-center py-40">
      <div class="w-10 h-10 border-2 border-brand-primary/20 border-t-brand-secondary rounded-full animate-spin mb-6"></div>
      <span class="font-mono text-xs tracking-[0.2em] uppercase text-brand-secondary">Mengakses Database Olfaktori...</span>
    </div>

    <div v-else-if="productStore.error" class="max-w-7xl mx-auto px-6 py-40 text-center">
      <h2 class="font-display text-4xl text-brand-primary mb-4">Produk Tidak Ditemukan</h2>
      <p class="font-body text-brand-on-surface-variant mb-8">{{ productStore.error }}</p>
      <router-link to="/collection" class="inline-flex items-center gap-2 font-mono text-xs text-brand-secondary border-b border-brand-secondary pb-1 uppercase tracking-widest">
        <ArrowLeft class="w-4 h-4" />
        Kembali ke Koleksi
      </router-link>
    </div>

    <!-- Product Layout -->
    <div v-else-if="productStore.currentProduct" class="max-w-7xl mx-auto px-6 md:px-8">
      
      <!-- Back Link -->
      <router-link to="/collection" class="inline-flex items-center gap-2 font-mono text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-brand-interface-gray hover:text-brand-secondary transition-colors duration-300 mb-12">
        <ArrowLeft class="w-4 h-4" />
        Kembali ke Koleksi
      </router-link>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        <!-- Left: Image Section -->
        <div class="relative bg-brand-surface-lowest border border-brand-primary/10 p-12 lg:p-20 flex items-center justify-center min-h-[60vh] overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-tr from-brand-deep-black/40 to-transparent opacity-50 z-0"></div>
          
          <div class="absolute top-8 left-8 flex gap-2 z-20">
            <span v-if="productStore.currentProduct.isNew" class="inline-flex px-3 py-1.5 bg-brand-primary text-brand-on-primary font-mono text-[10px] font-medium tracking-[0.2em] uppercase">
              BARU
            </span>
          </div>
          <div class="absolute top-8 right-8 z-20">
            <!-- UUID hidden -->
          </div>

          <!-- Actual Product Image -->
          <img v-if="productStore.currentProduct.image_url" :src="productStore.currentProduct.image_url" :alt="productStore.currentProduct.name" class="absolute inset-0 w-full h-full object-cover z-10" />

          <!-- Structural Bottle Representation Fallback -->
          <div v-else class="w-40 h-72 border border-brand-primary/30 bg-brand-surface relative z-10 shadow-[0_0_50px_rgba(168,200,255,0.05)]">
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-10 border border-brand-primary/30 bg-brand-surface-bright"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-brand-deep-black/80 to-transparent"></div>
            <!-- Decorative Label -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-brand-primary/10 bg-brand-deep-black/50 backdrop-blur-sm p-4 w-4/5 text-center flex flex-col items-center">
              <span class="font-mono text-[8px] text-brand-interface-gray tracking-[0.2em] block mb-2">{{ productStore.currentProduct.type }}</span>
              <span class="font-display text-sm font-bold uppercase tracking-widest text-brand-primary">{{ productStore.currentProduct.name }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Details Section -->
        <div class="flex flex-col justify-center">
          
          <!-- Header -->
          <div class="mb-10">
            <span class="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-brand-secondary mb-4 block">
              {{ productStore.currentProduct.brand }} / {{ productStore.currentProduct.category }}
            </span>
            <h1 class="font-display text-5xl lg:text-6xl font-bold uppercase tracking-wide mb-6">
              {{ productStore.currentProduct.name }}
            </h1>
            <p class="font-body text-lg text-brand-on-surface-variant leading-relaxed">
              {{ productStore.currentProduct.description }}
            </p>
          </div>

          <!-- Notes Pyramid -->
          <div class="mb-12 p-6 bg-brand-surface-lowest/50 border border-brand-primary/10">
            <h3 class="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-primary mb-6 border-b border-brand-primary/10 pb-4">
              Piramida Aroma
            </h3>
            <ul class="flex flex-col gap-4 font-mono text-xs">
              <li class="grid grid-cols-4 gap-4">
                <span class="text-brand-interface-gray uppercase tracking-widest">Top</span>
                <span class="col-span-3 text-brand-on-surface-variant">{{ productStore.currentProduct.notes?.top || '-' }}</span>
              </li>
              <li class="grid grid-cols-4 gap-4">
                <span class="text-brand-interface-gray uppercase tracking-widest">Middle</span>
                <span class="col-span-3 text-brand-on-surface-variant">{{ productStore.currentProduct.notes?.middle || '-' }}</span>
              </li>
              <li class="grid grid-cols-4 gap-4">
                <span class="text-brand-interface-gray uppercase tracking-widest">Base</span>
                <span class="col-span-3 text-brand-on-surface-variant">{{ productStore.currentProduct.notes?.base || '-' }}</span>
              </li>
            </ul>
          </div>

          <!-- Configuration Form -->
          <div class="flex flex-col gap-8">
            
            <!-- Size Selection -->
            <div>
              <div class="flex justify-between items-end mb-4">
                <label class="font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray">
                  Pilih Ukuran Decant
                </label>
                <span class="font-body text-2xl font-light tracking-wide text-brand-primary">{{ formattedPrice }}</span>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <button 
                  v-for="size in sizes" 
                  :key="size.id"
                  @click="selectedSize = size.id"
                  class="py-4 border font-mono text-xs font-semibold tracking-widest transition-all duration-300"
                  :class="selectedSize === size.id ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' : 'border-brand-primary/20 text-brand-primary hover:border-brand-primary/50'"
                >
                  {{ size.label }}
                </button>
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="flex gap-4">
              <!-- Quantity -->
              <div class="flex items-center border border-brand-primary/20 h-14">
                <button @click="decrement" class="w-14 h-full flex items-center justify-center text-brand-primary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-colors">
                  <Minus class="w-4 h-4" />
                </button>
                <span class="w-12 text-center font-mono text-sm font-semibold">{{ quantity }}</span>
                <button @click="increment" class="w-14 h-full flex items-center justify-center text-brand-primary hover:text-brand-secondary hover:bg-brand-secondary/5 transition-colors">
                  <Plus class="w-4 h-4" />
                </button>
              </div>

              <!-- Add to Cart Btn -->
              <button @click="addToCart" class="flex-grow inline-flex items-center justify-center gap-3 font-body text-sm font-semibold uppercase tracking-wider h-14 bg-brand-primary text-brand-on-primary hover:bg-brand-secondary hover:text-brand-on-secondary transition-all duration-300 group">
                <ShoppingBag class="w-4 h-4" />
                Tambah ke Keranjang
                <span class="font-normal opacity-70 ml-2">({{ totalPrice }})</span>
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>
