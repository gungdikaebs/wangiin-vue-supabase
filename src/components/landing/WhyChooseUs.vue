<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Diamond, TestTubeDiagonal, Zap, ShieldCheck } from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

const features = [
  {
    num: '01',
    icon: Diamond,
    title: 'Packaging Premium',
    desc: 'Experience unboxing mewah dari packaging sampai botol semprotan.'
  },
  {
    num: '02',
    icon: TestTubeDiagonal,
    title: 'Koleksi Terkurasi',
    desc: 'Cuma nyediain parfum-parfum terbaik yang wanginya udah pasti enak.'
  },
  {
    num: '03',
    icon: Zap,
    title: 'Spray Super Halus',
    desc: 'Botol spray kita ngasih semprotan yang halus dan nyebar banget.'
  },
  {
    num: '04',
    icon: ShieldCheck,
    title: '100% Original',
    desc: 'Jaminan isi parfum 100% asli, dipindah pake alat steril yang aman.'
  }
]

onMounted(() => {
  const cards = sectionRef.value.querySelectorAll('.value-card')

  gsap.fromTo(cards,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
      }
    }
  )
})
</script>

<template>
  <section ref="sectionRef" class="py-24 md:py-32 border-b border-brand-primary/10 bg-brand-surface-lowest relative overflow-hidden">
    <!-- Ambient Glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-secondary/5 rounded-full blur-[150px] mix-blend-screen"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

      <div class="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
        <span class="font-mono text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-brand-secondary mb-4 flex items-center justify-center gap-4">
          <div class="h-[1px] w-8 bg-brand-secondary"></div>
          04 / Kenapa Pilih Kami
          <div class="h-[1px] w-8 bg-brand-secondary"></div>
        </span>
        <h2 class="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide">
          Kualitas Tanpa <br class="md:hidden" /><span class="text-brand-secondary">Kompromi</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(feature, index) in features" :key="index"
          class="value-card relative bg-brand-surface border border-brand-primary/10 p-8 min-h-[320px] flex flex-col hover:border-brand-secondary/40 hover:bg-brand-secondary/[0.03] transition-all duration-500 overflow-hidden group hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] cursor-default">
          <!-- Watermark Background Number -->
          <span
            class="absolute -bottom-8 -right-4 text-[160px] font-display font-light text-transparent pointer-events-none transition-all duration-700 leading-none group-hover:scale-110 origin-bottom-right"
            style="-webkit-text-stroke: 1px rgba(255,255,255,0.08);">
            {{ feature.num }}
          </span>

          <!-- Top Accent Line -->
          <div
            class="absolute left-0 top-0 w-full h-1 bg-brand-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500">
          </div>

          <!-- Icon Container -->
          <div
            class="w-14 h-14 bg-brand-deep-black border border-brand-primary/20 flex items-center justify-center mb-10 group-hover:border-brand-secondary group-hover:shadow-[0_0_20px_rgba(168,200,255,0.15)] transition-all duration-500 relative z-10">
            <component :is="feature.icon"
              class="w-5 h-5 text-brand-primary/70 group-hover:text-brand-secondary transition-colors duration-500" />
          </div>

          <!-- Text Content -->
          <div class="mt-auto relative z-10">
            <h3
              class="font-display text-xl font-bold uppercase tracking-wide mb-3 group-hover:text-brand-primary transition-colors duration-300">
              {{ feature.title }}
            </h3>
            <p
              class="font-body text-sm text-brand-on-surface-variant leading-relaxed group-hover:text-brand-on-surface transition-colors duration-300">
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
