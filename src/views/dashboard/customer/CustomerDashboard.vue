<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { User, ShoppingBag, MapPin, LogOut, Package } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const currentTab = ref('orders')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Mock Data for Customer
const myOrders = [
  { id: 'WGN-1002', date: 'Hari ini', status: 'Diproses', total: 'Rp 1.250.000', items: 'Carbon Iris (5ml), Silicon Oud (10ml)' },
  { id: 'WGN-0854', date: '12 Mei 2026', status: 'Selesai', total: 'Rp 450.000', items: 'Neon Bergamot (2ml), Synthetic Rose (2ml)' }
]
</script>

<template>
  <div class="flex-grow flex flex-col md:flex-row bg-brand-deep-black max-w-7xl mx-auto w-full px-6 md:px-8 py-12 gap-12">
    
    <!-- Sidebar Navigation -->
    <aside class="w-full md:w-64 flex-shrink-0">
      <div class="mb-10">
        <h1 class="font-display text-3xl uppercase tracking-widest text-brand-primary line-clamp-1">
          Halo, {{ authStore.user?.user_metadata?.full_name?.split(' ')[0] || 'Klien' }}
        </h1>
        <p class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mt-2">
          {{ authStore.user?.email }}
        </p>
      </div>

      <nav class="flex flex-col gap-2">
        <button 
          @click="currentTab = 'orders'"
          class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-l-2"
          :class="currentTab === 'orders' ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' : 'border-transparent text-brand-interface-gray hover:text-brand-primary hover:border-brand-primary/30'"
        >
          <ShoppingBag class="w-4 h-4" />
          Riwayat Pesanan
        </button>
        
        <button 
          @click="currentTab = 'profile'"
          class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-l-2"
          :class="currentTab === 'profile' ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' : 'border-transparent text-brand-interface-gray hover:text-brand-primary hover:border-brand-primary/30'"
        >
          <User class="w-4 h-4" />
          Profil Saya
        </button>

        <button 
          @click="currentTab = 'address'"
          class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 border-l-2"
          :class="currentTab === 'address' ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' : 'border-transparent text-brand-interface-gray hover:text-brand-primary hover:border-brand-primary/30'"
        >
          <MapPin class="w-4 h-4" />
          Alamat Tersimpan
        </button>

        <div class="h-[1px] w-full bg-brand-primary/10 my-4"></div>

        <button @click="handleLogout" class="flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">
          <LogOut class="w-4 h-4" />
          Keluar
        </button>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-grow">
      
      <!-- Orders Tab -->
      <div v-if="currentTab === 'orders'">
        <h2 class="font-mono text-sm tracking-widest uppercase text-brand-secondary mb-8 pb-4 border-b border-brand-primary/10">Riwayat Pesanan Anda</h2>
        
        <div v-if="myOrders.length === 0" class="flex flex-col items-center justify-center py-20 border border-dashed border-brand-primary/20 bg-brand-surface-lowest/50">
          <Package class="w-10 h-10 text-brand-interface-gray mb-4" />
          <span class="font-mono text-xs tracking-widest uppercase text-brand-interface-gray mb-2">Belum Ada Pesanan</span>
          <router-link to="/collection" class="mt-4 font-mono text-[10px] tracking-widest uppercase text-brand-secondary border-b border-brand-secondary pb-1">Mulai Belanja</router-link>
        </div>

        <div v-else class="flex flex-col gap-6">
          <div v-for="order in myOrders" :key="order.id" class="bg-brand-surface border border-brand-primary/10 p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:border-brand-primary/30 transition-colors">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="font-mono text-xs font-bold text-brand-primary">{{ order.id }}</span>
                <span class="inline-flex px-2 py-1 text-[9px] font-mono tracking-widest uppercase" 
                  :class="{
                    'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20': order.status === 'Diproses',
                    'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20': order.status === 'Selesai'
                  }">
                  {{ order.status }}
                </span>
              </div>
              <p class="font-mono text-[10px] tracking-widest text-brand-interface-gray mb-4">{{ order.date }}</p>
              <p class="font-body text-sm text-brand-on-surface-variant">{{ order.items }}</p>
            </div>
            
            <div class="flex flex-col md:items-end gap-3 border-t md:border-t-0 border-brand-primary/10 pt-4 md:pt-0">
              <span class="font-body text-sm font-semibold text-brand-primary">{{ order.total }}</span>
              <button class="font-mono text-[9px] uppercase tracking-widest border border-brand-primary/20 px-4 py-2 hover:border-brand-secondary hover:text-brand-secondary transition-colors">
                Lacak Pengiriman
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholders for other tabs -->
      <div v-else class="flex flex-col items-center justify-center py-32 opacity-50 border border-dashed border-brand-primary/20 bg-brand-surface-lowest">
        <User v-if="currentTab === 'profile'" class="w-12 h-12 text-brand-interface-gray mb-4" />
        <MapPin v-else-if="currentTab === 'address'" class="w-12 h-12 text-brand-interface-gray mb-4" />
        
        <h3 class="font-display text-xl uppercase tracking-widest text-brand-interface-gray mb-2">Segera Hadir</h3>
        <p class="font-body text-sm text-brand-on-surface-variant text-center max-w-md">Fitur pengelolaan profil ini sedang dalam tahap pengerjaan.</p>
      </div>

    </main>
  </div>
</template>
