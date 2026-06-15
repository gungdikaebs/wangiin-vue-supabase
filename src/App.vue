<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from './plugins/supabase'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import CartDrawer from './components/cart/CartDrawer.vue'

const authStore = useAuthStore()
const route = useRoute()

const isAdminDashboard = computed(() => {
  return route.path.startsWith('/dashboard') && authStore.role === 'admin'
})

const isQuizPage = computed(() => route.path === '/quiz')
const showLayout = computed(() => !isAdminDashboard.value && !isQuizPage.value)

onMounted(async () => {
  await authStore.checkSession()

  // Listen for auth state changes from Supabase
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      authStore.user = session.user
      authStore.isAuthenticated = true
      await authStore.fetchUserProfile()
    } else {
      authStore.user = null
      authStore.role = null
      authStore.isAuthenticated = false
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-brand-deep-black text-brand-on-background font-body flex flex-col">
    <Navbar v-if="showLayout" />
    <main class="flex-grow" :class="{ 'pt-20': showLayout }"> <!-- pt-20 to account for fixed navbar -->
      <router-view />
    </main>
    <Footer v-if="showLayout" />
    <CartDrawer v-if="!isQuizPage" />
  </div>
</template>

<style>
/* Global scrollbar styling for a premium feel */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-brand-deep-black); 
}
::-webkit-scrollbar-thumb {
  background: var(--color-brand-surface-bright); 
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-brand-secondary); 
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
