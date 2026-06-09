<script setup>
import { ref, onMounted } from 'vue'
import { orderService } from '../../../services/orderService'
import { Search, Package, MoreVertical, Edit2, Truck, CheckCircle2, Clock, Eye, X } from 'lucide-vue-next'

const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')

const fetchOrders = async () => {
  loading.value = true
  orders.value = await orderService.getAllOrders()
  loading.value = false
}

const showDetailModal = ref(false)
const selectedOrder = ref(null)
const detailLoading = ref(false)

const viewOrder = async (orderId) => {
  showDetailModal.value = true
  detailLoading.value = true
  selectedOrder.value = await orderService.getOrderDetails(orderId)
  detailLoading.value = false
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
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
                  <button @click="viewOrder(order.id)" class="p-2 text-brand-interface-gray hover:text-brand-primary transition-colors" title="Lihat Detail"><Eye class="w-4 h-4" /></button>
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

    <!-- Order Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 bg-brand-deep-black/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div class="w-full max-w-2xl bg-brand-surface border border-brand-primary/10 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        
        <div class="flex justify-between items-center p-6 border-b border-brand-primary/10">
          <h2 class="font-display text-xl uppercase tracking-widest text-brand-primary">Detail Pesanan</h2>
          <button @click="closeDetailModal" class="text-brand-interface-gray hover:text-brand-primary transition-colors"><X class="w-5 h-5" /></button>
        </div>

        <div class="p-6 overflow-y-auto flex-grow">
          <div v-if="detailLoading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-secondary rounded-full animate-spin"></div>
          </div>
          <div v-else-if="selectedOrder" class="space-y-8">
            
            <!-- Order Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p class="font-mono text-xs text-brand-interface-gray tracking-widest mb-1">{{ selectedOrder.formattedDate }}</p>
                <p class="font-display text-2xl uppercase tracking-widest text-brand-primary">{{ selectedOrder.order_number }}</p>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border" 
                  :class="{
                    'bg-brand-surface-lowest text-brand-interface-gray border-brand-primary/20': selectedOrder.status === 'pending' || selectedOrder.status === 'unpaid',
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': selectedOrder.status === 'processing',
                    'bg-blue-500/10 text-blue-500 border-blue-500/20': selectedOrder.status === 'shipped',
                    'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20': selectedOrder.status === 'completed'
                  }">
                  {{ selectedOrder.status === 'unpaid' ? 'Menunggu Pembayaran' : selectedOrder.status }}
              </span>
            </div>

            <!-- Customer & Shipping -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-brand-surface-lowest border border-brand-primary/10">
              <div>
                <h3 class="font-mono text-[10px] uppercase tracking-widest text-brand-interface-gray mb-3 border-b border-brand-primary/10 pb-2">Informasi Pelanggan</h3>
                <p class="font-body text-sm text-brand-on-surface mb-1 font-medium">{{ selectedOrder.full_name }}</p>
                <p class="font-body text-xs text-brand-interface-gray mb-1">{{ selectedOrder.email }}</p>
                <p class="font-body text-xs text-brand-interface-gray">{{ selectedOrder.phone }}</p>
              </div>
              <div>
                <h3 class="font-mono text-[10px] uppercase tracking-widest text-brand-interface-gray mb-3 border-b border-brand-primary/10 pb-2">Alamat Pengiriman</h3>
                <p class="font-body text-sm text-brand-on-surface mb-1">{{ selectedOrder.address }}</p>
                <p class="font-body text-xs text-brand-interface-gray mb-1">{{ selectedOrder.city }}</p>
                <p class="font-body text-xs text-brand-interface-gray">Kode Pos: {{ selectedOrder.postal_code }}</p>
              </div>
            </div>

            <!-- Order Items -->
            <div>
              <h3 class="font-mono text-[10px] uppercase tracking-widest text-brand-interface-gray mb-4">Item Pesanan</h3>
              <div class="space-y-3">
                <div v-for="(item, idx) in selectedOrder.order_items" :key="idx" class="flex justify-between items-center p-3 border border-brand-primary/10 bg-brand-surface-lowest/50">
                  <div>
                    <p class="font-body text-sm text-brand-primary uppercase tracking-wide">{{ item.product ? item.product.name : 'Produk Dihapus' }}</p>
                    <p class="font-mono text-[10px] text-brand-interface-gray mt-1">Ukuran: {{ item.variant ? item.variant.size : '-' }} &bull; Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="font-mono text-sm text-brand-primary">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price_at_time * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="border-t border-brand-primary/20 pt-4 flex justify-end">
              <div class="w-full md:w-1/2 space-y-2">
                <div class="flex justify-between font-mono text-xs text-brand-interface-gray">
                  <span>Subtotal</span>
                  <span>{{ selectedOrder.formattedSubtotal }}</span>
                </div>
                <div class="flex justify-between font-mono text-xs text-brand-interface-gray">
                  <span>Ongkos Kirim</span>
                  <span>{{ selectedOrder.formattedShipping }}</span>
                </div>
                <div class="flex justify-between font-mono text-sm text-brand-primary pt-2 border-t border-brand-primary/10 font-bold">
                  <span>Total Bayar</span>
                  <span>{{ selectedOrder.formattedTotal }}</span>
                </div>
                <div class="flex justify-between font-mono text-[10px] text-brand-interface-gray pt-1">
                  <span>Metode Pembayaran</span>
                  <span class="uppercase">{{ selectedOrder.payment_method === 'manual_transfer' ? 'Transfer Manual' : selectedOrder.payment_method }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
