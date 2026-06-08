<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { CheckCircle2, ArrowRight } from 'lucide-vue-next'

useHead({
  title: 'Pembayaran Berhasil | Wangiin'
})

const route = useRoute()
const orderId = computed(() => route.query.order_id || 'WANGIIN-XXXXXX')
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center pt-20 pb-32 px-6">
    <div class="max-w-md w-full bg-brand-surface border border-brand-primary/10 p-10 md:p-14 flex flex-col items-center text-center">
      
      <div class="w-20 h-20 bg-brand-secondary/10 rounded-full flex items-center justify-center mb-8">
        <CheckCircle2 class="w-10 h-10 text-brand-secondary" />
      </div>

      <h1 class="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-brand-primary mb-4">
        Pesanan Diterima
      </h1>
      
      <p class="font-body text-sm text-brand-on-surface-variant leading-relaxed mb-6">
        Terima kasih! Pesanan Anda telah tercatat dengan aman di sistem kami. Untuk memproses pengiriman, silakan lakukan pembayaran manual ke rekening di bawah ini.
      </p>

      <!-- Bank Transfer Details -->
      <div class="w-full bg-brand-surface-lowest p-6 border border-brand-primary/10 mb-6 text-left">
        <span class="font-mono text-[10px] text-brand-interface-gray tracking-[0.2em] uppercase block mb-4 border-b border-brand-primary/10 pb-2">Informasi Transfer</span>
        
        <div class="flex justify-between items-center mb-4">
          <span class="font-mono text-xs text-brand-on-surface-variant uppercase tracking-widest">Bank BCA</span>
          <span class="font-display text-lg font-bold text-brand-primary tracking-widest">873 1234 567</span>
        </div>
        <div class="text-sm font-body text-brand-on-surface-variant">a.n. PT Wangiin Olfaktori</div>
      </div>

      <div class="w-full bg-brand-surface-lowest p-6 border border-brand-primary/5 mb-10">
        <span class="font-mono text-[9px] text-brand-interface-gray tracking-[0.2em] uppercase block mb-2">ID Pesanan Anda</span>
        <span class="font-mono text-sm md:text-base font-bold text-brand-secondary tracking-widest">{{ orderId }}</span>
      </div>

      <div class="w-full flex flex-col gap-4">
        <a :href="`https://wa.me/6281234567890?text=Halo%20Wangiin!%20Saya%20ingin%20konfirmasi%20pembayaran%20untuk%20Order%20ID:%20${orderId}`" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 font-body text-xs font-semibold uppercase tracking-wider h-12 bg-brand-secondary text-brand-on-secondary hover:bg-brand-secondary/80 transition-colors duration-300">
          Konfirmasi via WhatsApp
        </a>
        
        <router-link to="/dashboard" class="w-full inline-flex items-center justify-center font-body text-xs font-semibold uppercase tracking-wider h-12 bg-brand-primary text-brand-on-primary hover:bg-brand-primary/80 transition-colors duration-300">
          Cek Status Pesanan
        </router-link>
        
        <router-link to="/collection" class="w-full inline-flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest h-12 border border-brand-primary/20 text-brand-primary hover:border-brand-primary/50 transition-colors">
          Lanjut Eksplorasi
          <ArrowRight class="w-3 h-3" />
        </router-link>
      </div>

    </div>
  </div>
</template>
