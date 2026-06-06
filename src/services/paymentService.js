// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const paymentService = {
  /**
   * Mocks a request to a backend to generate a Midtrans Snap Token
   */
  async createTransaction(orderData) {
    await delay(1000) // Fake API latency
    
    // In a real app, you would send orderData to your backend (Laravel/Node)
    // and the backend would call Midtrans API to get the token.
    
    // Generate a fake unique order ID
    const orderId = `WANGIIN-${Math.floor(Math.random() * 1000000)}`
    
    return {
      success: true,
      orderId: orderId,
      // Fake Snap token
      token: `mock-snap-token-${Date.now()}`
    }
  },

  /**
   * Mocks the Midtrans Snap Popup UI flow
   */
  async simulateSnapPayment(token) {
    return new Promise((resolve, reject) => {
      // Create a fake modal overlay to simulate Midtrans
      const overlay = document.createElement('div')
      overlay.className = 'fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'
      overlay.id = 'mock-midtrans-overlay'
      
      const modal = document.createElement('div')
      modal.className = 'bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl flex flex-col'
      
      modal.innerHTML = `
        <div class="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
          <img src="https://midtrans.com/assets/img/midtrans-logo.png" alt="Midtrans" class="h-6" onerror="this.outerHTML='<span class=\\'font-bold text-gray-800\\'>Mock Midtrans</span>'" />
          <button id="mock-midtrans-close" class="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div class="p-6 flex-grow flex flex-col items-center text-center">
          <p class="text-gray-600 text-sm mb-4">Simulasi Pembayaran (Token: ${token.substring(0, 8)}...)</p>
          <div class="grid grid-cols-2 gap-3 w-full mb-6">
            <button class="mock-pay-btn border border-gray-300 rounded-lg py-3 hover:bg-blue-50 hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span class="font-semibold text-sm">QRIS</span>
            </button>
            <button class="mock-pay-btn border border-gray-300 rounded-lg py-3 hover:bg-blue-50 hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span class="font-semibold text-sm">GoPay</span>
            </button>
            <button class="mock-pay-btn border border-gray-300 rounded-lg py-3 hover:bg-blue-50 hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span class="font-semibold text-sm">BCA VA</span>
            </button>
            <button class="mock-pay-btn border border-gray-300 rounded-lg py-3 hover:bg-blue-50 hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span class="font-semibold text-sm">Mandiri VA</span>
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-auto">Hanya simulasi untuk testing Phase 5</p>
        </div>
      `
      
      overlay.appendChild(modal)
      document.body.appendChild(overlay)
      
      // Handle Close
      document.getElementById('mock-midtrans-close').addEventListener('click', () => {
        document.body.removeChild(overlay)
        resolve({ status: 'closed' })
      })
      
      // Handle Pay
      const payBtns = modal.querySelectorAll('.mock-pay-btn')
      payBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
          // Show loading state
          modal.innerHTML = `
            <div class="p-12 flex flex-col items-center justify-center text-center h-full">
              <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="font-semibold text-gray-800">Memproses Pembayaran...</p>
            </div>
          `
          
          await delay(2000)
          
          document.body.removeChild(overlay)
          resolve({ status: 'success' })
        })
      })
    })
  }
}
