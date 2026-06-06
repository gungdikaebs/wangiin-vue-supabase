<script setup>
import { ref } from 'vue'
import { Plus, Minus } from 'lucide-vue-next'

const faqs = [
  {
    question: 'APAKAH DEKANT INI 100% ORIGINAL?',
    answer: 'Pasti original 100%. Kita pindahin isinya langsung dari botol asli ke botol decant pakai alat khusus biar wanginya nggak berubah sama sekali.'
  },
  {
    question: 'DEKANT 5ML BISA DIPAKAI BERAPA LAMA?',
    answer: 'Satu botol 5ml bisa buat 65-75 kali spray. Kalau kamu pakai 3x sehari, bisa awet sampai 3-4 minggu. Pas banget buat dicobain sehari-hari.'
  },
  {
    question: 'BISA KIRIM KE LUAR KOTA?',
    answer: 'Bisa banget! Kita kirim ke seluruh Indonesia dengan packaging yang super aman biar botol decant-nya nggak bocor dan tetap wangi sampai tujuan.'
  },
  {
    question: 'CARA SIMPAN DECANT BIAR WANGINYA AWET?',
    answer: 'Simpan aja di tempat yang adem dan nggak kena sinar matahari langsung, kayak di dalam laci atau lemari baju. Jangan ditinggal di mobil ya biar wanginya nggak rusak.'
  }
]

const activeIndex = ref(null)

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" ref="sectionRef" class="py-24 md:py-32 border-b border-brand-primary/10 relative overflow-hidden">
    <!-- Ambient Glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-1/4 left-0 -translate-x-1/2 w-[700px] h-[700px] bg-brand-secondary/5 rounded-full blur-[140px] mix-blend-screen"></div>
    </div>

    <div class="max-w-2xl mx-auto px-6 md:px-8 relative z-10">
      
      <div class="text-center mb-16 flex flex-col items-center">
        <span class="font-mono text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-brand-secondary mb-4 flex items-center justify-center gap-4">
          <div class="h-[1px] w-8 bg-brand-secondary"></div>
          06 / Tanya Jawab
          <div class="h-[1px] w-8 bg-brand-secondary"></div>
        </span>
        <h2 class="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide">
          Pertanyaan <br class="md:hidden" /><span class="text-brand-secondary">Umum</span>
        </h2>
      </div>

      <div class="border-t border-brand-primary/20">
        <div v-for="(faq, index) in faqs" :key="index" class="border-b border-brand-primary/20 transition-colors duration-300 relative group" :class="{'bg-brand-secondary/[0.02] border-brand-secondary/30': activeIndex === index}">
          <!-- Left blue accent indicator -->
          <div class="absolute left-0 top-0 w-1 h-full bg-brand-secondary scale-y-0 origin-top transition-transform duration-300" :class="{'scale-y-100': activeIndex === index}"></div>
          
          <button 
            @click="toggleFaq(index)"
            class="w-full flex justify-between items-center py-6 px-4 md:px-6 focus:outline-none text-left"
          >
            <h3 class="font-display text-lg md:text-xl font-bold uppercase tracking-wide group-hover:text-brand-secondary transition-colors duration-300" :class="{'text-brand-secondary': activeIndex === index}">
              {{ faq.question }}
            </h3>
            <span class="ml-6 transition-colors duration-300" :class="activeIndex === index ? 'text-brand-secondary' : 'text-brand-primary/50 group-hover:text-brand-secondary'">
              <Plus v-if="activeIndex !== index" class="w-6 h-6" />
              <Minus v-else class="w-6 h-6" />
            </span>
          </button>
          
          <div 
            class="overflow-hidden transition-all duration-500 ease-in-out px-4 md:px-6"
            :class="activeIndex === index ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'"
          >
            <p class="font-body text-brand-on-surface-variant leading-relaxed max-w-3xl">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-20 text-center">
        <p class="font-mono text-[9px] text-brand-interface-gray mb-6 tracking-[0.2em]">
          MASIH PUNYA PERTANYAAN LAIN YANG MAU DITANYAIN?
        </p>
        <button class="inline-flex items-center justify-center font-mono text-[10px] font-medium uppercase tracking-[0.2em] px-8 py-5 bg-transparent text-brand-primary border border-brand-primary/30 hover:border-brand-secondary hover:text-brand-secondary transition-colors duration-500 cursor-pointer">
          CHAT ADMIN
        </button>
      </div>

    </div>
  </section>
</template>
