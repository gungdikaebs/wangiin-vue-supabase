<script setup>
import { defineAsyncComponent } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '../../stores/auth'

useHead({
  title: 'Dashboard | Wangiin'
})

const authStore = useAuthStore()

// Lazy load the dashboards to split code
const AdminDashboard = defineAsyncComponent(() => import('./admin/AdminDashboard.vue'))
const CustomerDashboard = defineAsyncComponent(() => import('./customer/CustomerDashboard.vue'))
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] flex flex-col">
    <!-- Loading State while checking role -->
    <div v-if="authStore.loading" class="flex-grow flex flex-col items-center justify-center py-40">
      <div class="w-10 h-10 border-2 border-brand-primary/20 border-t-brand-secondary rounded-full animate-spin mb-6"></div>
      <span class="font-mono text-xs tracking-[0.2em] uppercase text-brand-secondary">Memuat Dashboard...</span>
    </div>
    
    <!-- Render Admin Dashboard -->
    <AdminDashboard v-else-if="authStore.role === 'admin'" />
    
    <!-- Render Customer Dashboard -->
    <CustomerDashboard v-else />
  </div>
</template>
