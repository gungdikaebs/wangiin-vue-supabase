<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

onMounted(() => {
  const elements = sectionRef.value.querySelectorAll('.animate-up')
  
  elements.forEach((el, index) => {
    gsap.fromTo(el, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    )
  })
})
</script>

<template>
  <section ref="sectionRef" class="py-24 md:py-40 border-b border-brand-primary/10 relative overflow-hidden">
    <!-- Ambient Glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-brand-secondary/10 rounded-full blur-[150px] mix-blend-screen"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        <!-- Typography & Story -->
        <div class="lg:col-span-7 flex flex-col gap-8">
          <span class="animate-up font-mono text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-brand-secondary flex items-center gap-4">
            <div class="h-[1px] w-8 bg-brand-secondary"></div>
            02 / Tentang Kami
          </span>
          <h2 class="animate-up font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] tracking-wide">
            Eksplorasi Aroma<br/>
            <span class="text-brand-secondary">Tanpa Batasan</span>
          </h2>
          <div class="animate-up h-[1px] w-24 bg-brand-primary/20"></div>
          <p class="animate-up font-body text-lg text-brand-on-surface-variant leading-relaxed">
            Di Wangiin, kita percaya wangi itu bagian dari identitas. Kami hadir ngebawa koleksi parfum high-end original, langsung ke tangan kamu dengan cara yang lebih smart.
          </p>
          <p class="animate-up font-body text-lg text-brand-on-surface-variant leading-relaxed">
            Lewat decant ukuran 2ml, 5ml, dan 10ml, kamu bebas cobain berbagai macam wangi parfum mewah tanpa harus komitmen beli full bottle-nya. Cocok banget buat kamu yang suka gonta-ganti wangi sesuai mood.
          </p>
        </div>

        <!-- Technical Data / "Anatomy" Layout -->
        <div class="lg:col-span-5 relative">
          <div class="animate-up absolute inset-0 bg-brand-surface border border-brand-primary/10 transform translate-x-4 translate-y-4"></div>
          <div class="animate-up relative bg-brand-surface-lowest border border-brand-primary/20 p-8 h-full flex flex-col justify-between">
            <div>
              <span class="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-interface-gray mb-6 block">
                KUALITAS TERJAMIN
              </span>
              <ul class="flex flex-col gap-6 font-mono text-sm">
                <li class="flex justify-between items-center border-b border-brand-primary/5 pb-4">
                  <span class="text-brand-on-surface-variant">PROSES PEMINDAHAN</span>
                  <span class="text-brand-primary">STERIL & AMAN</span>
                </li>
                <li class="flex justify-between items-center border-b border-brand-primary/5 pb-4">
                  <span class="text-brand-on-surface-variant">PILIHAN UKURAN</span>
                  <span class="text-brand-primary">2ML / 5ML / 10ML</span>
                </li>
                <li class="flex justify-between items-center border-b border-brand-primary/5 pb-4">
                  <span class="text-brand-on-surface-variant">KUALITAS SPRAY</span>
                  <span class="text-brand-primary">HALUS & MERATA</span>
                </li>
                <li class="flex justify-between items-center pb-2">
                  <span class="text-brand-on-surface-variant">KEASLIAN BARANG</span>
                  <span class="text-brand-secondary">100% ORIGINAL</span>
                </li>
              </ul>
            </div>
            
            <div class="mt-12 pt-6 border-t border-brand-secondary/30">
               <p class="font-mono text-xs text-brand-secondary leading-relaxed">
                 [INFO] Semua proses pemindahan isi parfum ke botol decant dilakukan pake alat steril biar wangi aslinya nggak berubah sama sekali.
               </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
