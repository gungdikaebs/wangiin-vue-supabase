<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-vue-next'

import { useProductStore } from '../../stores/product'
import ProductCard from '../catalog/ProductCard.vue'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchFeaturedProducts()
  
  // Wait for DOM to update
  setTimeout(() => {
    const cards = sectionRef.value.querySelectorAll('.product-card')
    if (cards.length === 0) return
    
    gsap.fromTo(cards, 
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%',
        }
      }
    )
  }, 100)
})
</script>

<template>
  <section ref="sectionRef" class="py-24 md:py-32 border-b border-brand-primary/10 relative overflow-hidden">
    <!-- Ambient Glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[140px] mix-blend-screen"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
          <span class="font-mono text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-brand-secondary mb-4 block flex items-center gap-4">
            <div class="h-[1px] w-8 bg-brand-secondary"></div>
            03 / Koleksi Kami
          </span>
          <h2 class="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide">
            Rekomendasi Parfum Pilihan
          </h2>
        </div>
        <router-link to="/collection" class="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-300 group">
          LIHAT SEMUA KOLEKSI
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <!-- Product Grid -->
      <div v-if="productStore.loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-secondary rounded-full animate-spin"></div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProductCard 
          v-for="product in productStore.featuredProducts.slice(0, 3)" 
          :key="product.id" 
          :product="product" 
        />
      </div>

    </div>
  </section>
</template>
