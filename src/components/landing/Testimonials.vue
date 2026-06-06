<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote } from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

const testimonials = [
  {
    name: 'ALEXANDER D.',
    role: 'KOLEKTOR',
    content: 'Kualitas decant-nya gila sih. Wanginya bener-bener sama persis kayak di botol aslinya, nggak ada beda sama sekali.'
  },
  {
    name: 'SARAH M.',
    role: 'PENGGEMAR PARFUM',
    content: 'Berkat Wangiin aku bisa cobain parfum mahal yang dari dulu maju-mundur mau beli. Plus packagingnya super niat!'
  },
  {
    name: 'JONATHAN K.',
    role: 'AHLI PARFUM',
    content: 'Trusted banget. Bener-bener ngebantu buat yang suka gonta-ganti wangi tanpa harus ngabisin dompet buat full bottle.'
  }
]

onMounted(() => {
  const cards = sectionRef.value.querySelectorAll('.testimony-card')

  gsap.fromTo(cards,
    { y: 50, opacity: 0 },
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
})
</script>

<template>
  <section ref="sectionRef" class="py-24 md:py-32 border-b border-brand-primary/10 relative overflow-hidden">
    <!-- Ambient Glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div
        class="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[700px] h-[700px] bg-brand-secondary/5 rounded-full blur-[150px] mix-blend-screen">
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

      <div class="mb-16">
        <span
          class="font-mono text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-brand-secondary mb-4 block flex items-center gap-4">
          <div class="h-[1px] w-8 bg-brand-secondary"></div>
          05 / Kata Mereka
        </span>
        <h2 class="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide">
          Review Customer
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(item, index) in testimonials" :key="index"
          class="testimony-card relative overflow-hidden bg-transparent border border-brand-primary/10 p-8 md:p-12 hover:border-brand-secondary/50 hover:bg-brand-surface-lowest transition-all duration-700 flex flex-col justify-between group cursor-default">
          <!-- Blue Top Accent Bar -->
          <div
            class="absolute top-0 left-0 w-full h-[1px] bg-brand-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700">
          </div>

          <!-- Massive Serif Quote Mark Watermark -->
          <span
            class="absolute -top-4 -left-2 text-[200px] font-display font-light text-brand-primary/[0.04] pointer-events-none group-hover:text-brand-secondary/[0.08] transition-colors duration-700 leading-none">
            "
          </span>

          <div class="relative z-10">
            <p
              class="font-display text-xl font-medium text-brand-on-surface-variant leading-relaxed mb-12 group-hover:text-brand-primary transition-colors duration-500">
              "{{ item.content }}"
            </p>
          </div>

          <div class="pt-6 relative z-10 flex items-center justify-between">
            <div>
              <h4 class="font-display text-lg font-bold uppercase tracking-widest mb-1">{{ item.name }}</h4>
              <span class="font-mono text-[9px] text-brand-secondary tracking-[0.2em] uppercase">{{ item.role }}</span>
            </div>
            <div class="h-[1px] flex-grow bg-brand-primary/10 ml-8 group-hover:bg-brand-secondary/30 transition-colors">
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
