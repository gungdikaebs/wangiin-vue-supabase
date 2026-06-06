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
        Pembayaran<br>Berhasil
      </h1>
      
      <p class="font-body text-sm text-brand-on-surface-variant leading-relaxed mb-8">
        Terima kasih! Pesanan Anda sedang diproses. Kami akan mengirimkan email konfirmasi beserta resi pengiriman segera setelah paket diberangkatkan.
      </p>

      <div class="w-full bg-brand-surface-lowest p-6 border border-brand-primary/5 mb-10">
        <span class="font-mono text-[9px] text-brand-interface-gray tracking-[0.2em] uppercase block mb-2">ID Pesanan Anda</span>
        <span class="font-mono text-sm md:text-base font-bold text-brand-secondary tracking-widest">{{ orderId }}</span>
      </div>

      <div class="w-full flex flex-col gap-4">
        <!-- Will link to Order History in Phase 6 -->
        <router-link to="/dashboard" class="w-full inline-flex items-center justify-center font-body text-xs font-semibold uppercase tracking-wider h-12 bg-brand-primary text-brand-on-primary hover:bg-brand-secondary hover:text-brand-on-secondary transition-colors duration-300">
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
