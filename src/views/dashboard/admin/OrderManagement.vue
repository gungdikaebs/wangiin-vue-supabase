<script setup>
import { ref, onMounted } from 'vue'
import { orderService } from '../../../services/orderService'
import { Search, Package, MoreVertical, Edit2, Truck, CheckCircle2, Clock } from 'lucide-vue-next'

const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')

const fetchOrders = async () => {
  loading.value = true
  orders.value = await orderService.getAllOrders()
  loading.value = false
}

onMounted(() => {
  fetchOrders()
})

const updateStatus = async (orderId, newStatus) => {
  const success = await orderService.updateOrderStatus(orderId, newStatus)
  if (success) {
    // Update local state without refetching all
    const order = orders.value.find(o => o.id === orderId)
    if (order) order.status = newStatus
  } else {
    alert('Gagal mengubah status pesanan')
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-end mb-10">
      <div>
        <h1 class="font-display text-4xl font-bold uppercase tracking-wide text-brand-primary">Manajemen Pesanan</h1>
        <p class="font-mono text-xs text-brand-interface-gray tracking-widest mt-2 uppercase">Kelola status pesanan masuk</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div class="relative w-full md:w-96">
        <input v-model="searchQuery" type="text" placeholder="Cari ID Pesanan atau Nama..." class="w-full bg-brand-surface-lowest border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-10 focus:outline-none focus:border-brand-secondary transition-colors" />
        <Search class="w-4 h-4 text-brand-interface-gray absolute left-4 top-1/2 -translate-y-1/2" />
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-brand-surface border border-brand-primary/10 overflow-hidden flex-grow flex flex-col">
      <div class="overflow-x-auto flex-grow relative">
        
        <!-- Loading State -->
        <div v-if="loading" class="absolute inset-0 bg-brand-surface/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-secondary rounded-full animate-spin"></div>
        </div>

        <table class="w-full text-left font-body text-sm min-w-[800px]">
          <thead class="bg-brand-surface-lowest border-b border-brand-primary/10 font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray sticky top-0 z-0">
            <tr>
              <th class="p-4 font-normal">ID Pesanan</th>
              <th class="p-4 font-normal">Tanggal & Waktu</th>
              <th class="p-4 font-normal">Pelanggan</th>
              <th class="p-4 font-normal">Rincian Barang</th>
              <th class="p-4 font-normal">Total</th>
              <th class="p-4 font-normal">Status</th>
              <th class="p-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orders.length === 0 && !loading">
              <td colspan="7" class="p-12 text-center text-brand-interface-gray font-mono text-xs uppercase tracking-widest">
                Belum ada data pesanan
              </td>
            </tr>
            <tr v-for="(order, index) in orders" :key="order.id" class="border-b border-brand-primary/5 hover:bg-brand-surface-lowest transition-colors" :class="{'border-b-0': index === orders.length - 1}">
              <td class="p-4 font-mono text-xs font-bold text-brand-primary">{{ order.orderNumber }}</td>
              <td class="p-4 text-brand-interface-gray">{{ order.date }}</td>
              <td class="p-4 text-brand-on-surface-variant font-medium">{{ order.customerName }}</td>
              <td class="p-4 text-brand-interface-gray text-xs truncate max-w-[200px]" :title="order.items">{{ order.items }}</td>
              <td class="p-4 font-semibold text-brand-primary">{{ order.total }}</td>
              <td class="p-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono tracking-widest uppercase" 
                  :class="{
                    'bg-brand-surface-lowest text-brand-interface-gray border border-brand-primary/20': order.status === 'pending' || order.status === 'unpaid',
                    'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20': order.status === 'processing',
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20': order.status === 'shipped',
                    'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20': order.status === 'completed'
                  }">
                  {{ order.status === 'unpaid' ? 'Menunggu Pembayaran' : order.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2">
                  <button v-if="order.status === 'pending' || order.status === 'unpaid'" @click="updateStatus(order.id, 'processing')" class="p-2 text-brand-interface-gray hover:text-yellow-500 transition-colors" title="Proses Pesanan"><Clock class="w-4 h-4" /></button>
                  <button v-if="order.status === 'processing'" @click="updateStatus(order.id, 'shipped')" class="p-2 text-brand-interface-gray hover:text-blue-500 transition-colors" title="Kirim Pesanan"><Truck class="w-4 h-4" /></button>
                  <button v-if="order.status === 'shipped'" @click="updateStatus(order.id, 'completed')" class="p-2 text-brand-interface-gray hover:text-brand-secondary transition-colors" title="Selesaikan Pesanan"><CheckCircle2 class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
