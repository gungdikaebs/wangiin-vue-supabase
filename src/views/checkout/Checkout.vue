<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useCartStore } from '../../stores/cart'
import { paymentService } from '../../services/paymentService'
import { ChevronLeft, ArrowRight, ShieldCheck, Truck } from 'lucide-vue-next'

useHead({
  title: 'Checkout | Wangiin'
})

const router = useRouter()
const cartStore = useCartStore()

// If cart is empty, redirect back
if (cartStore.items.length === 0) {
  router.push('/collection')
}

// Form Data
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
})

const isProcessing = ref(false)
const shippingCost = 25000 // Fixed for simulation

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const subtotal = computed(() => cartStore.cartTotal)
const total = computed(() => subtotal.value + shippingCost)

const handleCheckout = async () => {
  isProcessing.value = true
  
  try {
    // 1. Send order to "backend" to get snap token
    const orderData = {
      items: cartStore.items,
      customer: form.value,
      total: total.value
    }
    
    const response = await paymentService.createTransaction(orderData)
    
    if (response.success) {
      // 2. Trigger Midtrans Mock Popup
      const result = await paymentService.simulateSnapPayment(response.token)
      
      if (result.status === 'success') {
        // Clear cart and redirect to success
        cartStore.clearCart()
        router.push({
          path: '/checkout/success',
          query: { order_id: response.orderId }
        })
      } else {
        // User closed popup
        console.log('Payment popup closed')
      }
    }
  } catch (err) {
    console.error('Checkout error:', err)
    alert('Terjadi kesalahan saat memproses pembayaran.')
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="min-h-screen pt-12 pb-32 bg-brand-deep-black">
    <div class="max-w-7xl mx-auto px-6 md:px-8">
      
      <!-- Back Link -->
      <router-link to="/collection" class="inline-flex items-center gap-2 font-mono text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-brand-interface-gray hover:text-brand-secondary transition-colors duration-300 mb-10">
        <ChevronLeft class="w-4 h-4" />
        Kembali Belanja
      </router-link>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        <!-- Left: Form -->
        <div class="lg:col-span-7">
          <h1 class="font-display text-4xl font-bold uppercase tracking-wide mb-10">
            Pengiriman & Pembayaran
          </h1>

          <form @submit.prevent="handleCheckout" class="flex flex-col gap-8">
            
            <!-- Contact Info -->
            <div class="bg-brand-surface-lowest p-8 border border-brand-primary/10">
              <h2 class="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-brand-secondary mb-6 border-b border-brand-primary/10 pb-4">
                Informasi Kontak
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 block">Nama Lengkap</label>
                  <input required v-model="form.fullName" type="text" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" placeholder="Cth: John Doe" />
                </div>
                <div>
                  <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 block">Alamat Email</label>
                  <input required v-model="form.email" type="email" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 block">Nomor Telepon</label>
                  <input required v-model="form.phone" type="tel" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" placeholder="0812xxxx" />
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="bg-brand-surface-lowest p-8 border border-brand-primary/10">
              <h2 class="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-brand-secondary mb-6 border-b border-brand-primary/10 pb-4">
                Alamat Pengiriman
              </h2>
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 block">Alamat Lengkap</label>
                  <textarea required v-model="form.address" rows="3" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors resize-none" placeholder="Nama Jalan, Gedung, No. Rumah..."></textarea>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 block">Kota/Kabupaten</label>
                    <input required v-model="form.city" type="text" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" placeholder="Cth: Jakarta Selatan" />
                  </div>
                  <div>
                    <label class="font-mono text-[10px] text-brand-interface-gray tracking-widest uppercase mb-2 block">Kode Pos</label>
                    <input required v-model="form.postalCode" type="text" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" placeholder="12345" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" :disabled="isProcessing" class="w-full inline-flex items-center justify-center gap-3 font-body text-sm font-semibold uppercase tracking-wider h-16 bg-brand-primary text-brand-on-primary hover:bg-brand-secondary hover:text-brand-on-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4">
              <span v-if="isProcessing">Memproses...</span>
              <template v-else>
                Pilih Metode Pembayaran
                <ArrowRight class="w-4 h-4" />
              </template>
            </button>
            
            <div class="flex items-center justify-center gap-2 text-brand-interface-gray font-mono text-[9px] uppercase tracking-widest opacity-60">
              <ShieldCheck class="w-3 h-3" />
              Pembayaran Aman via Midtrans
            </div>
            
          </form>
        </div>

        <!-- Right: Order Summary -->
        <div class="lg:col-span-5">
          <div class="bg-brand-surface p-8 border border-brand-primary/10 sticky top-28">
            <h2 class="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-brand-secondary mb-6 border-b border-brand-primary/10 pb-4">
              Ringkasan Pesanan
            </h2>

            <!-- Items -->
            <div class="flex flex-col gap-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              <div v-for="item in cartStore.items" :key="`${item.productId}-${item.size}`" class="flex gap-4">
                <div class="w-16 h-20 bg-brand-deep-black border border-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <div class="w-6 h-10 border border-brand-primary/20 bg-brand-surface-lowest"></div>
                </div>
                <div class="flex-grow flex flex-col justify-center">
                  <h4 class="font-display text-sm uppercase tracking-wide text-brand-primary">{{ item.name }}</h4>
                  <p class="font-mono text-[9px] text-brand-interface-gray tracking-widest mb-2">{{ item.size }} &times; {{ item.quantity }}</p>
                  <p class="font-body text-sm">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t border-brand-primary/10 pt-6 flex flex-col gap-4">
              <div class="flex justify-between items-center text-brand-on-surface-variant font-body text-sm">
                <span>Subtotal ({{ cartStore.totalItems }} Item)</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between items-center text-brand-on-surface-variant font-body text-sm">
                <span class="flex items-center gap-2"><Truck class="w-4 h-4" /> Pengiriman Reguler</span>
                <span>{{ formatPrice(shippingCost) }}</span>
              </div>
              
              <div class="border-t border-brand-primary/10 mt-2 pt-4 flex justify-between items-center">
                <span class="font-mono text-xs tracking-widest uppercase text-brand-interface-gray">Total Bayar</span>
                <span class="font-display text-2xl font-bold tracking-wider text-brand-primary">{{ formatPrice(total) }}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>
