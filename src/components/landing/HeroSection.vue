<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-vue-next'

const heroTitle = ref(null)
const heroTitleSpan = ref(null)
const heroSubtitle = ref(null)
const heroCta = ref(null)
const heroImage = ref(null)

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(heroTitle.value,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
  )
    .fromTo(heroTitleSpan.value,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2 },
      '-=0.8'
    )
    .fromTo(heroSubtitle.value,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    )
    .fromTo(heroCta.value,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(heroImage.value,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' },
      '-=1.5'
    )
})
</script>

<template>
  <section
    class="relative min-h-screen flex items-center overflow-hidden border-b border-brand-primary/10 bg-brand-deep-black">

    <!-- Ambient Glows -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-32 -left-32 w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[140px] mix-blend-screen">
      </div>
      <div
        class="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] mix-blend-screen">
      </div>
    </div>

    <!-- Massive Editorial Image (Right/Background) -->
    <div ref="heroImage" class="absolute top-0 right-0 w-full lg:w-[65%] h-full z-0 opacity-40 lg:opacity-70">
      <!-- Gradient Fades to blend seamlessly into the dark background -->
      <div class="absolute inset-0 bg-brand-deep-black/70 lg:bg-transparent z-10"></div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-brand-deep-black via-brand-deep-black/60 to-transparent z-10 hidden lg:block">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-brand-deep-black via-transparent to-brand-deep-black z-10">
      </div>
      <div class="absolute inset-0 bg-gradient-to-l from-brand-deep-black/30 via-transparent to-transparent z-10"></div>

      <img src="/img/hero.png" alt="Wangiin" class="w-full h-full object-cover object-center mix-blend-lighten" />
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-8 w-full z-20 relative pt-20">
      <div class="max-w-4xl relative">

        <!-- Section Label -->
        <span
          class="font-mono text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-brand-secondary mb-8 block flex items-center gap-4">
          <div class="h-[1px] w-12 bg-brand-secondary"></div>
          01 / Koleksi
        </span>

        <!-- Massive Editorial Title -->
        <h1
          class="font-editorial text-6xl md:text-8xl lg:text-[9rem] font-light leading-[0.9] tracking-tighter mb-8 uppercase text-brand-primary relative z-20">
          <div ref="heroTitle">Wangiin</div>
          <div ref="heroTitleSpan" class="text-transparent italic pl-0 lg:pl-20"
            style="-webkit-text-stroke: 1px var(--color-brand-primary);">Decant</div>
        </h1>

        <!-- Elegant Subtitle -->
        <p ref="heroSubtitle"
          class="font-body text-lg md:text-xl font-light leading-relaxed text-brand-on-surface-variant max-w-md mb-12 pl-0 lg:pl-24">
          Rasakan kemewahan wewangian dalam genggaman. Koleksi decant original pilihan yang dirancang khusus untuk
          menyempurnakan setiap gaya dan cerita Kamu.
        </p>

        <!-- Editorial CTA Buttons -->
        <div ref="heroCta" class="flex flex-col sm:flex-row gap-6 items-start pl-0 lg:pl-24">
          <router-link to="/collection"
            class="inline-flex items-center justify-center gap-4 font-mono text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] px-8 py-5 bg-brand-primary text-brand-on-primary hover:bg-brand-secondary hover:text-brand-on-secondary transition-colors duration-500 cursor-pointer group">
            Lihat Koleksi
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </router-link>

          <router-link to="/quiz"
            class="inline-flex items-center justify-center font-mono text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] px-8 py-5 bg-transparent text-brand-primary border border-brand-primary/30 hover:border-brand-secondary hover:text-brand-secondary transition-colors duration-500 cursor-pointer">
            Temukan Wangimu
          </router-link>
        </div>

      </div>
    </div>

    <!-- Floating Technical Micro-text (Editorial Touch) -->
    <div class="absolute bottom-12 right-12 hidden lg:flex flex-col items-end z-20">
      <span class="font-mono text-[9px] tracking-[0.2em] text-brand-primary/40 uppercase block mb-1">KUALITAS
        PREMIUM</span>
      <span class="font-mono text-xs tracking-[0.1em] text-brand-secondary">100% ORIGINAL</span>
    </div>

    <div class="absolute bottom-12 left-12 hidden lg:flex items-center gap-4 z-20 opacity-50">
      <div class="w-px h-12 bg-brand-primary"></div>
      <span class="font-mono text-[9px] tracking-[0.3em] text-brand-primary uppercase rotate-180"
        style="writing-mode: vertical-rl;">
        SCROLL KE BAWAH
      </span>
    </div>

  </section>
</template>
