<script setup>
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { ArrowRight, Loader2, Mail } from 'lucide-vue-next'

useHead({
  title: 'Recover | Wangiin',
})

const email = ref('')
const loading = ref(false)
const message = ref('')

const handleRecover = async () => {
  if (!email.value) return
  loading.value = true
  
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  message.value = 'If the entity exists, a recovery sequence has been dispatched.'
  loading.value = false
}
</script>

<template>
  <div class="min-h-[85vh] flex items-center justify-center py-20 px-6 relative overflow-hidden">
    <!-- Ambient Glow Background -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-secondary/10 rounded-full blur-[150px] mix-blend-screen"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      
      <!-- Header -->
      <div class="text-center mb-10">
        <span class="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-brand-secondary mb-4 block">
          Recovery Protocol
        </span>
        <h1 class="font-display text-3xl font-bold uppercase tracking-widest text-brand-primary">
          Restore Access
        </h1>
      </div>

      <!-- Form Container -->
      <div class="bg-brand-surface-lowest border border-brand-primary/20 p-8 relative overflow-hidden group">
        <!-- Accent Line -->
        <div class="absolute top-0 left-0 w-full h-[2px] bg-brand-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"></div>

        <div v-if="message" class="mb-6 p-4 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary font-mono text-xs tracking-wider">
          {{ message }}
        </div>

        <form @submit.prevent="handleRecover" class="flex flex-col gap-6">
          <p class="font-body text-sm text-brand-on-surface-variant leading-relaxed">
            Enter your designation (email) below. We will transmit a secure quantum link to reset your security key.
          </p>

          <!-- Email Input -->
          <div>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
              <input 
                v-model="email"
                type="email" 
                class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 pl-12 pr-4 focus:outline-none focus:border-brand-secondary transition-colors"
                placeholder="client@wangiin.com"
                required
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="loading || !!message"
            class="mt-2 w-full inline-flex items-center justify-center gap-3 font-body text-xs md:text-sm font-semibold uppercase tracking-wider px-8 py-4 bg-brand-primary text-brand-on-primary border border-transparent hover:bg-transparent hover:text-brand-primary hover:border-brand-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-btn"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <template v-else>
              Transmit Sequence
              <ArrowRight class="w-4 h-4" />
            </template>
          </button>
        </form>
      </div>

      <!-- Footer Link -->
      <div class="mt-8 text-center flex flex-col gap-3">
        <p class="font-mono text-xs text-brand-interface-gray tracking-wider">
          REMEMBERED SECURITY KEY? 
          <router-link to="/login" class="text-brand-secondary hover:text-brand-primary underline underline-offset-4 ml-2 transition-colors">
            ACCESS PORTAL
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>
