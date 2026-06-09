import { supabase } from '../plugins/supabase'

export const orderService = {
  async getCustomerOrders(customerId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          created_at,
          order_items (
            quantity,
            price_at_time,
            product:products (
              name
            )
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(order => {
        // Format date
        const date = new Date(order.created_at)
        const formattedDate = new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date)

        // Format items summary
        const itemsSummary = order.order_items.map(item => {
          const productName = item.product ? item.product.name : 'Produk Dihapus'
          return `${productName} (${item.quantity}x)`
        }).join(', ')

        // Format price
        const formattedTotal = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(order.total_amount)

        // Translate status
        let displayStatus = 'Pending'
        if (order.status === 'processing') displayStatus = 'Diproses'
        if (order.status === 'shipped') displayStatus = 'Dikirim'
        if (order.status === 'completed') displayStatus = 'Selesai'

        return {
          id: order.order_number,
          rawId: order.id,
          date: formattedDate,
          status: displayStatus,
          rawStatus: order.status,
          total: formattedTotal,
          items: itemsSummary
        }
      })
    } catch (error) {
      console.error('Error fetching customer orders:', error)
      return []
    }
  },

  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          created_at,
          full_name,
          payment_method,
          order_items (
            quantity,
            product:products (
              name
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(order => {
        // Format date
        const date = new Date(order.created_at)
        const formattedDate = new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)

        // Format items summary
        const itemsSummary = order.order_items.map(item => {
          const productName = item.product ? item.product.name : 'Produk Dihapus'
          return `${productName} (${item.quantity}x)`
        }).join(', ')

        const formattedTotal = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(order.total_amount)

        return {
          id: order.id,
          orderNumber: order.order_number,
          customerName: order.full_name,
          date: formattedDate,
          status: order.status,
          total: formattedTotal,
          items: itemsSummary,
          paymentMethod: order.payment_method === 'manual_transfer' ? 'Transfer Manual' : order.payment_method
        }
      })
    } catch (error) {
      console.error('Error fetching all orders:', error)
      return []
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating order status:', error)
      return false
    }
  },

  async getOrderDetails(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            product:products ( name ),
            variant:product_variants ( size )
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error
      
      // Formatting
      data.formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
      }).format(data.total_amount)
      
      data.formattedShipping = new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
      }).format(data.shipping_cost || 0)

      const subtotal = data.total_amount - (data.shipping_cost || 0)
      data.formattedSubtotal = new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
      }).format(subtotal)

      data.formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date(data.created_at))

      return data
    } catch (err) {
      console.error('Error fetching order details:', err)
      return null
    }
  }
}
