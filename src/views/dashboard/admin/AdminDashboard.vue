<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, TrendingUp, Search, Menu, X } from 'lucide-vue-next'
import ProductManagement from './ProductManagement.vue'
import OrderManagement from './OrderManagement.vue'

const router = useRouter()
const authStore = useAuthStore()

const currentTab = ref('overview')
const isMobileMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Mock Data for Admin
const stats = [
  { label: 'Total Penjualan', value: 'Rp 45.500.000', trend: '+12.5%' },
  { label: 'Pesanan Bulan Ini', value: '124', trend: '+5.2%' },
  { label: 'Pelanggan Baru', value: '48', trend: '+18.1%' }
]

const recentOrders = [
  { id: 'WGN-1002', customer: 'Budi Santoso', date: 'Hari ini', status: 'Diproses', total: 'Rp 1.250.000' },
  { id: 'WGN-1001', customer: 'Siti Aminah', date: 'Kemarin', status: 'Dikirim', total: 'Rp 850.000' },
  { id: 'WGN-1000', customer: 'Andi Wijaya', date: 'Kemarin', status: 'Selesai', total: 'Rp 450.000' }
]
</script>

<template>
  <div class="flex-grow flex bg-brand-deep-black">

    <!-- Mobile Sidebar Overlay -->
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-brand-deep-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"></div>

    <!-- Sidebar -->
    <aside 
      class="w-64 border-r border-brand-primary/10 bg-brand-surface-lowest flex-col min-h-screen fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none lg:flex"
      :class="isMobileMenuOpen ? 'translate-x-0 flex' : '-translate-x-full lg:translate-x-0 hidden'"
    >
      <div class="p-8 border-b border-brand-primary/10 flex justify-between items-start">
        <div>
          <span class="font-mono text-[10px] tracking-widest text-brand-secondary uppercase">Super Admin</span>
          <h2 class="font-display text-xl uppercase tracking-widest text-brand-primary mt-2 line-clamp-1">
            {{ authStore.user?.user_metadata?.full_name || 'Admin' }}
          </h2>
        </div>
        <button @click="isMobileMenuOpen = false" class="lg:hidden text-brand-interface-gray hover:text-brand-primary">
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-grow py-6 flex flex-col gap-2 px-4">
        <button @click="currentTab = 'overview'; isMobileMenuOpen = false"
          class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300"
          :class="currentTab === 'overview' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' : 'text-brand-interface-gray hover:text-brand-primary hover:bg-brand-primary/5'">
          <LayoutDashboard class="w-4 h-4" />
          Overview
        </button>
        <button @click="currentTab = 'products'; isMobileMenuOpen = false"
          class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300"
          :class="currentTab === 'products' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' : 'text-brand-interface-gray hover:text-brand-primary hover:bg-brand-primary/5'">
          <Package class="w-4 h-4" />
          Produk
        </button>
        <button @click="currentTab = 'orders'; isMobileMenuOpen = false"
          class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300"
          :class="currentTab === 'orders' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' : 'text-brand-interface-gray hover:text-brand-primary hover:bg-brand-primary/5'">
          <ShoppingCart class="w-4 h-4" />
          Pesanan
        </button>
        <button @click="currentTab = 'customers'; isMobileMenuOpen = false"
          class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-300"
          :class="currentTab === 'customers' ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20' : 'text-brand-interface-gray hover:text-brand-primary hover:bg-brand-primary/5'">
          <Users class="w-4 h-4" />
          Pelanggan
        </button>
      </nav>

      <div class="p-4 border-t border-brand-primary/10">
        <button @click="handleLogout"
          class="w-full flex items-center justify-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-colors border border-transparent hover:border-red-400/20">
          <LogOut class="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-grow p-6 md:p-12 overflow-y-auto">

      <!-- Mobile Sidebar Toggle / Header -->
      <div class="lg:hidden mb-4 pb-4 border-b border-brand-primary/10 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button @click="isMobileMenuOpen = true" class="text-brand-interface-gray hover:text-brand-primary p-2 -ml-2">
            <Menu class="w-6 h-6" />
          </button>
          <div>
            <span class="font-mono text-[10px] tracking-widest text-brand-secondary uppercase">Super Admin</span>
            <h2 class="font-display text-xl uppercase tracking-widest text-brand-primary mt-1 line-clamp-1">
              {{ authStore.user?.user_metadata?.full_name || 'Admin' }}
            </h2>
          </div>
        </div>
        <button @click="handleLogout" class="text-red-400 p-2">
          <LogOut class="w-5 h-5" />
        </button>
      </div>

      <div v-if="currentTab === 'overview'">
        <div class="flex justify-between items-end mb-10">
          <h1 class="font-display text-4xl font-bold uppercase tracking-wide">Ringkasan Bisnis</h1>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div v-for="stat in stats" :key="stat.label"
            class="bg-brand-surface border border-brand-primary/10 p-8 flex flex-col relative overflow-hidden group hover:border-brand-primary/30 transition-colors duration-500">
            <div
              class="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-secondary/5 rounded-full blur-xl group-hover:bg-brand-secondary/10 transition-colors duration-500">
            </div>
            <span
              class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-4 relative z-10">{{
                stat.label }}</span>
            <span class="font-display text-3xl text-brand-primary relative z-10">{{ stat.value }}</span>
            <div class="mt-4 flex items-center gap-2 text-[10px] font-mono text-brand-secondary relative z-10">
              <TrendingUp class="w-3 h-3" />
              {{ stat.trend }} dari bulan lalu
            </div>
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-mono text-sm tracking-widest uppercase text-brand-primary">Pesanan Terbaru</h3>
            <button
              class="font-mono text-[10px] text-brand-secondary tracking-widest border-b border-brand-secondary pb-1 uppercase">Lihat
              Semua</button>
          </div>

          <div class="w-full overflow-x-auto border border-brand-primary/10">
            <table class="w-full text-left font-body text-sm">
              <thead
                class="bg-brand-surface-lowest border-b border-brand-primary/10 font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray">
                <tr>
                  <th class="p-4 font-normal">ID Pesanan</th>
                  <th class="p-4 font-normal">Pelanggan</th>
                  <th class="p-4 font-normal">Tanggal</th>
                  <th class="p-4 font-normal">Status</th>
                  <th class="p-4 font-normal text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in recentOrders" :key="order.id"
                  class="border-b border-brand-primary/5 hover:bg-brand-surface/30 transition-colors"
                  :class="{ 'border-b-0': index === recentOrders.length - 1 }">
                  <td class="p-4 font-mono text-xs text-brand-primary">{{ order.id }}</td>
                  <td class="p-4 text-brand-on-surface-variant">{{ order.customer }}</td>
                  <td class="p-4 text-brand-interface-gray">{{ order.date }}</td>
                  <td class="p-4">
                    <span class="inline-flex px-2 py-1 text-[9px] font-mono tracking-widest uppercase" :class="{
                      'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20': order.status === 'Diproses',
                      'bg-blue-500/10 text-blue-500 border border-blue-500/20': order.status === 'Dikirim',
                      'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20': order.status === 'Selesai'
                    }">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="p-4 text-right font-medium text-brand-primary">{{ order.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Product Management Tab -->
      <div v-else-if="currentTab === 'products'" class="h-full">
        <ProductManagement />
      </div>

      <!-- Order Management Tab -->
      <div v-else-if="currentTab === 'orders'" class="h-full">
        <OrderManagement />
      </div>

      <!-- Placeholders for other tabs -->
      <div v-else
        class="flex flex-col items-center justify-center h-[60vh] opacity-50 border border-dashed border-brand-primary/20">
        <Users class="w-12 h-12 text-brand-interface-gray mb-4" />

        <h3 class="font-display text-xl uppercase tracking-widest text-brand-interface-gray mb-2">Segera Hadir</h3>
        <p class="font-body text-sm text-brand-on-surface-variant text-center max-w-md">Modul manajemen ini sedang dalam
          tahap pengembangan dan akan dirilis pada iterasi berikutnya.</p>
      </div>

    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
