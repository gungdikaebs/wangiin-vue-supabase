<script setup>
import { onMounted, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useProductStore } from '../../stores/product'
import ProductCard from '../../components/catalog/ProductCard.vue'
import { Search, ChevronLeft, ChevronRight, FilterX } from 'lucide-vue-next'

useHead({
  title: 'Koleksi | Wangiin',
})

const productStore = useProductStore()

onMounted(() => {
  productStore.loadCategories()
  productStore.fetchProducts()
})

const handleSearch = (e) => {
  productStore.setSearchQuery(e.target.value)
}

const clearFilters = () => {
  productStore.setCategory('All')
  productStore.setSearchQuery('')
}
</script>

<template>
  <div class="min-h-screen pt-12 pb-32">
    <!-- Page Header -->
    <div class="max-w-7xl mx-auto px-6 md:px-8 mb-16">
      <span class="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-brand-secondary mb-4 block">
        03 / Archive
      </span>
      <h1 class="font-display text-5xl md:text-7xl font-bold uppercase tracking-wide">
        Koleksi Lengkap
      </h1>
      <div class="h-[1px] w-32 bg-brand-primary/20 mt-8"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-12">
      
      <!-- Sidebar Filters -->
      <aside class="lg:col-span-1 flex flex-col gap-10">
        
        <!-- Search -->
        <div>
          <h3 class="font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray mb-4">Pencarian</h3>
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
            <input 
              :value="productStore.searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="Cari parfum..." 
              class="w-full bg-brand-surface-lowest border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 pl-12 pr-4 focus:outline-none focus:border-brand-secondary transition-colors"
            />
          </div>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray mb-4">Kategori Aroma</h3>
          <div class="flex flex-col gap-2">
            <button 
              v-for="category in productStore.categories" 
              :key="category"
              @click="productStore.setCategory(category)"
              class="text-left font-body text-sm py-2 px-4 border-l-2 transition-all duration-300 uppercase tracking-wider font-medium"
              :class="productStore.currentCategory === category ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' : 'border-transparent text-brand-on-surface-variant hover:text-brand-primary hover:border-brand-primary/30'"
            >
              {{ category === 'All' ? 'Semua Aroma' : category }}
            </button>
          </div>
        </div>

        <!-- Active Filters Status -->
        <div v-if="productStore.currentCategory !== 'All' || productStore.searchQuery" class="pt-6 border-t border-brand-primary/10">
          <button @click="clearFilters" class="inline-flex items-center gap-2 font-mono text-[10px] text-brand-interface-gray hover:text-red-400 transition-colors uppercase tracking-widest">
            <FilterX class="w-3 h-3" />
            Hapus Filter
          </button>
        </div>

      </aside>

      <!-- Main Content -->
      <div class="lg:col-span-3">
        
        <!-- Header & Stats -->
        <div class="flex justify-between items-end mb-8 pb-4 border-b border-brand-primary/10">
          <p class="font-mono text-xs text-brand-interface-gray tracking-widest">
            Menampilkan {{ productStore.products.length }} dari {{ productStore.totalItems }} produk
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="productStore.loading" class="flex flex-col items-center justify-center py-32 opacity-50">
          <div class="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-secondary rounded-full animate-spin mb-4"></div>
          <span class="font-mono text-[10px] tracking-widest uppercase text-brand-secondary">Memuat Data...</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="productStore.products.length === 0" class="flex flex-col items-center justify-center py-32 border border-dashed border-brand-primary/20 bg-brand-surface-lowest/50">
          <span class="font-mono text-xs tracking-widest uppercase text-brand-interface-gray mb-2">Data Tidak Ditemukan</span>
          <p class="font-body text-sm text-brand-on-surface-variant">Coba gunakan kata kunci atau filter lain.</p>
          <button @click="clearFilters" class="mt-6 font-mono text-[10px] tracking-widest uppercase text-brand-secondary border-b border-brand-secondary pb-1">Reset Pencarian</button>
        </div>

        <!-- Product Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductCard 
            v-for="product in productStore.products" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <!-- Pagination -->
        <div v-if="productStore.totalPages > 1 && !productStore.loading" class="mt-16 flex items-center justify-center gap-2">
          <button 
            @click="productStore.setPage(productStore.currentPage - 1)"
            :disabled="productStore.currentPage === 1"
            class="w-10 h-10 flex items-center justify-center border border-brand-primary/20 text-brand-primary hover:border-brand-secondary hover:text-brand-secondary disabled:opacity-30 disabled:hover:border-brand-primary/20 disabled:hover:text-brand-primary transition-colors"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          
          <button 
            v-for="page in productStore.totalPages" 
            :key="page"
            @click="productStore.setPage(page)"
            class="w-10 h-10 flex items-center justify-center font-mono text-xs transition-colors"
            :class="productStore.currentPage === page ? 'bg-brand-primary text-brand-on-primary' : 'border border-brand-primary/20 text-brand-primary hover:border-brand-secondary hover:text-brand-secondary'"
          >
            {{ page }}
          </button>
          
          <button 
            @click="productStore.setPage(productStore.currentPage + 1)"
            :disabled="productStore.currentPage === productStore.totalPages"
            class="w-10 h-10 flex items-center justify-center border border-brand-primary/20 text-brand-primary hover:border-brand-secondary hover:text-brand-secondary disabled:opacity-30 disabled:hover:border-brand-primary/20 disabled:hover:text-brand-primary transition-colors"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  </div>
</template>
