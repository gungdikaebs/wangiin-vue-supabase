<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X, ShoppingBag } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'

const isMobileMenuOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-brand-deep-black/80 backdrop-blur-xl border-b border-brand-primary/10">
    <div class="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center h-20">
      
      <!-- Logo -->
      <router-link to="/" class="font-editorial text-xl md:text-2xl tracking-[0.2em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">
        Wangiin
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex gap-8 items-center">
        <router-link to="/#about" class="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">Tentang</router-link>
        <router-link to="/collection" class="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">Koleksi</router-link>
        <router-link to="/#faq" class="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">FAQ</router-link>
      </nav>

      <!-- Desktop Action -->
      <div class="hidden md:flex items-center gap-6">
        
        <!-- Cart Icon Desktop -->
        <button @click="cartStore.openCart" class="relative text-brand-primary hover:text-brand-secondary transition-colors duration-200">
          <ShoppingBag class="w-5 h-5" />
          <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-brand-secondary text-brand-on-secondary text-[9px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
            {{ cartStore.totalItems }}
          </span>
        </button>

        <div class="h-4 w-[1px] bg-brand-primary/20"></div>

        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">
            Dasbor
          </router-link>
          <button @click="handleLogout" class="inline-flex items-center justify-center font-body text-xs font-semibold uppercase tracking-wider px-6 py-2.5 bg-transparent text-brand-primary rounded-none border border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary transition-all duration-300 cursor-pointer">
            Keluar
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="inline-flex items-center justify-center font-body text-xs font-semibold uppercase tracking-wider px-6 py-2.5 bg-transparent text-brand-primary rounded-none border border-brand-primary/20 hover:border-brand-secondary hover:text-brand-secondary transition-all duration-300 cursor-pointer">
            Masuk
          </router-link>
        </template>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="md:hidden flex items-center gap-4">
        <!-- Cart Icon Mobile -->
        <button @click="cartStore.openCart" class="relative text-brand-primary hover:text-brand-secondary transition-colors duration-200">
          <ShoppingBag class="w-5 h-5" />
          <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-brand-secondary text-brand-on-secondary text-[9px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
            {{ cartStore.totalItems }}
          </span>
        </button>

        <button @click="toggleMobileMenu" class="text-brand-primary hover:text-brand-secondary transition-colors duration-200 focus:outline-none">
          <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMobileMenuOpen" class="md:hidden absolute top-20 left-0 w-full bg-brand-deep-black border-b border-brand-primary/10 flex flex-col py-6 px-6 gap-6 shadow-2xl">
      <router-link to="/#about" @click="toggleMobileMenu" class="font-mono text-sm font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">Tentang</router-link>
      <router-link to="/collection" @click="toggleMobileMenu" class="font-mono text-sm font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">Koleksi</router-link>
      <router-link to="/#faq" @click="toggleMobileMenu" class="font-mono text-sm font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">FAQ</router-link>
      
      
      <template v-if="authStore.isAuthenticated">
        <router-link to="/dashboard" @click="toggleMobileMenu" class="font-mono text-sm font-semibold tracking-[0.15em] uppercase text-brand-primary hover:text-brand-secondary transition-colors duration-200">Dasbor</router-link>
        <button @click="handleLogout" class="mt-4 w-full text-center inline-flex items-center justify-center font-body text-sm font-semibold uppercase tracking-wider px-6 py-3 bg-brand-primary text-brand-on-primary rounded-none border border-transparent">
          Keluar
        </button>
      </template>
      <template v-else>
        <router-link to="/login" @click="toggleMobileMenu" class="mt-4 text-center inline-flex items-center justify-center font-body text-sm font-semibold uppercase tracking-wider px-6 py-3 bg-brand-primary text-brand-on-primary rounded-none border border-transparent">
          Masuk
        </router-link>
      </template>
    </div>
  </header>
</template>
