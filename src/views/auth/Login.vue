<script setup>
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { ArrowRight, Loader2, KeyRound, Mail } from 'lucide-vue-next'

useHead({
  title: 'Login | Wangiin',
})

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const localError = ref('')

const handleLogin = async () => {
  localError.value = ''
  if (!email.value || !password.value) {
    localError.value = 'Please fill in all fields.'
    return
  }

  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (err) {
    // Error is handled in the store and exposed via authStore.error
  }
}

const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
  } catch (err) {
    // Error is handled in the store
  }
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
          Welcome Back
        </span>
        <h1 class="font-display text-3xl font-bold uppercase tracking-widest text-brand-primary">
          Login Dulu Yuk
        </h1>
      </div>

      <!-- Form Container -->
      <div class="bg-brand-surface-lowest border border-brand-primary/20 p-8 relative overflow-hidden group">
        <!-- Accent Line -->
        <div class="absolute top-0 left-0 w-full h-[2px] bg-brand-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"></div>

        <!-- Error Message -->
        <div v-if="authStore.error || localError" class="mb-6 p-4 bg-red-950/30 border border-red-500/30 text-red-400 font-mono text-xs tracking-wider">
          {{ authStore.error || localError }}
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
          
          <!-- Email Input -->
          <div>
            <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 block">
              Alamat Email
            </label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
              <input 
                v-model="email"
                type="email" 
                class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 pl-12 pr-4 focus:outline-none focus:border-brand-secondary transition-colors"
                placeholder="kamu@email.com"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 flex justify-between">
              <span>Password</span>
              <router-link to="/forgot-password" class="text-brand-secondary hover:text-brand-primary transition-colors">
                Lupa Password?
              </router-link>
            </label>
            <div class="relative">
              <KeyRound class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
              <input 
                v-model="password"
                type="password" 
                class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 pl-12 pr-4 focus:outline-none focus:border-brand-secondary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="mt-2 w-full inline-flex items-center justify-center gap-3 font-body text-xs md:text-sm font-semibold uppercase tracking-wider px-8 py-4 bg-brand-primary text-brand-on-primary border border-transparent hover:bg-transparent hover:text-brand-primary hover:border-brand-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-btn"
          >
            <Loader2 v-if="authStore.loading" class="w-4 h-4 animate-spin" />
            <template v-else>
              Masuk
              <ArrowRight class="w-4 h-4" />
            </template>
          </button>
        </form>

        <div class="my-8 flex items-center justify-center">
          <div class="h-[1px] w-full bg-brand-primary/10"></div>
          <span class="px-4 font-mono text-[10px] text-brand-primary/40 tracking-widest uppercase">ATAU</span>
          <div class="h-[1px] w-full bg-brand-primary/10"></div>
        </div>

        <!-- Google Login -->
        <button 
          @click="handleGoogleLogin"
          class="w-full inline-flex items-center justify-center gap-3 font-body text-xs font-semibold uppercase tracking-wider px-8 py-3 bg-brand-surface border border-brand-primary/20 hover:border-brand-secondary transition-colors duration-300"
        >
          <!-- Simple Google SVG Icon -->
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Masuk Pakai Google
        </button>

      </div>

      <!-- Footer Link -->
      <div class="mt-8 text-center">
        <p class="font-mono text-xs text-brand-interface-gray tracking-wider">
          BELUM PUNYA AKUN? 
          <router-link to="/register" class="text-brand-secondary hover:text-brand-primary underline underline-offset-4 ml-2 transition-colors">
            DAFTAR SEKARANG
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>
