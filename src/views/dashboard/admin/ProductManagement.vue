<script setup>
import { ref, onMounted } from 'vue'
import { productService } from '../../../services/productService'
import { supabase } from '../../../plugins/supabase'
import { Plus, Database, Edit, Trash2, X } from 'lucide-vue-next'

const products = ref([])
const loading = ref(true)
const isSeeding = ref(false)

const showModal = ref(false)
const formLoading = ref(false)
const categories = ref([])

// Form State
const isEditMode = ref(false)
const editingProductId = ref(null)
const form = ref({
  name: '',
  subtitle: '',
  description: '',
  category_id: '',
  top_notes: '',
  middle_notes: '',
  base_notes: '',
  is_new: false,
  price_2ml: 0,
  price_5ml: 0,
  price_10ml: 0,
  var_2ml_id: null,
  var_5ml_id: null,
  var_10ml_id: null
})

const fetchProducts = async () => {
  loading.value = true
  const res = await productService.getProducts({ limit: 100 }) // fetch all for admin
  products.value = res.data
  loading.value = false
}

const fetchCategories = async () => {
  const { data } = await supabase.from('categories').select('id, name')
  if (data) categories.value = data
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const handleSeed = async () => {
  if (confirm('Aksi ini akan menyuntikkan Mock Data lama ke dalam database. Lanjutkan?')) {
    isSeeding.value = true
    await productService.seedDatabase()
    await fetchProducts()
    isSeeding.value = false
    alert('Data berhasil disuntikkan!')
  }
}

const openModal = () => {
  isEditMode.value = false
  editingProductId.value = null
  form.value = {
    name: '', subtitle: '', description: '', category_id: categories.value[0]?.id || '',
    top_notes: '', middle_notes: '', base_notes: '', is_new: false,
    price_2ml: 0, price_5ml: 0, price_10ml: 0,
    var_2ml_id: null, var_5ml_id: null, var_10ml_id: null
  }
  showModal.value = true
}

const openEditModal = (p) => {
  isEditMode.value = true
  editingProductId.value = p.id
  
  const cat = categories.value.find(c => c.name === p.category)
  const v2 = p.variants?.find(v => v.size === '2 ML')
  const v5 = p.variants?.find(v => v.size === '5 ML')
  const v10 = p.variants?.find(v => v.size === '10 ML')

  form.value = {
    name: p.name,
    subtitle: p.subtitle || '',
    description: p.description || '',
    category_id: cat ? cat.id : categories.value[0]?.id,
    top_notes: p.notes?.top || '',
    middle_notes: p.notes?.middle || '',
    base_notes: p.notes?.base || '',
    is_new: p.isNew || false,
    price_2ml: v2?.price || 0,
    price_5ml: v5?.price || 0,
    price_10ml: v10?.price || 0,
    var_2ml_id: v2?.id || null,
    var_5ml_id: v5?.id || null,
    var_10ml_id: v10?.id || null
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveProduct = async () => {
  formLoading.value = true
  try {
    const slug = form.value.name.toLowerCase().replace(/ /g, '-')
    const productPayload = {
      name: form.value.name,
      slug: slug,
      category_id: form.value.category_id,
      subtitle: form.value.subtitle,
      description: form.value.description,
      top_notes: form.value.top_notes,
      middle_notes: form.value.middle_notes,
      base_notes: form.value.base_notes,
      is_new: form.value.is_new
    }

    if (isEditMode.value) {
      // 1. Update Product
      const { error: pErr } = await supabase.from('products').update(productPayload).eq('id', editingProductId.value)
      if (pErr) throw pErr

      // 2. Update Variants
      const updateVariant = async (id, size, price) => {
        if (id) {
          await supabase.from('product_variants').update({ price }).eq('id', id)
        } else {
          await supabase.from('product_variants').insert({ product_id: editingProductId.value, size, price, stock: 100 })
        }
      }
      
      await Promise.all([
        updateVariant(form.value.var_2ml_id, '2 ML', form.value.price_2ml),
        updateVariant(form.value.var_5ml_id, '5 ML', form.value.price_5ml),
        updateVariant(form.value.var_10ml_id, '10 ML', form.value.price_10ml)
      ])

    } else {
      // 1. Insert Product
      const { data: newProd, error: pErr } = await supabase.from('products').insert(productPayload).select().single()
      if (pErr) throw pErr

      // 2. Insert Variants
      const { error: vErr } = await supabase.from('product_variants').insert([
        { product_id: newProd.id, size: '2 ML', price: form.value.price_2ml, stock: 100 },
        { product_id: newProd.id, size: '5 ML', price: form.value.price_5ml, stock: 100 },
        { product_id: newProd.id, size: '10 ML', price: form.value.price_10ml, stock: 100 }
      ])
      if (vErr) throw vErr
    }

    closeModal()
    fetchProducts()
  } catch (err) {
    alert('Gagal menyimpan produk: ' + err.message)
    console.error(err)
  } finally {
    formLoading.value = false
  }
}

const deleteProduct = async (id) => {
  if (confirm('Yakin ingin menghapus produk ini?')) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      alert('Gagal menghapus produk')
    } else {
      fetchProducts()
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="font-display text-3xl font-bold uppercase tracking-wide text-brand-primary">Manajemen Produk</h1>
        <p class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mt-1">Mengelola katalog database asli</p>
      </div>

      <div class="flex gap-3">
        <button @click="handleSeed" :disabled="isSeeding" class="flex items-center gap-2 px-4 py-2 border border-brand-primary/20 text-brand-primary font-mono text-[10px] uppercase tracking-widest hover:bg-brand-primary/10 transition-colors disabled:opacity-50">
          <Database class="w-3 h-3" />
          {{ isSeeding ? 'Menyuntikkan...' : 'Suntik Data (Seeder)' }}
        </button>
        
        <button @click="openModal" class="flex items-center gap-2 px-4 py-2 bg-brand-secondary text-brand-on-secondary font-mono text-[10px] uppercase tracking-widest hover:bg-brand-secondary/90 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <Plus class="w-3 h-3" />
          Tambah Produk
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-brand-surface border border-brand-primary/10 overflow-x-auto">
      <table class="w-full text-left font-body text-sm">
        <thead class="bg-brand-surface-lowest border-b border-brand-primary/10 font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray">
          <tr>
            <th class="p-4 font-normal">Nama Parfum</th>
            <th class="p-4 font-normal">Kategori</th>
            <th class="p-4 font-normal">Status</th>
            <th class="p-4 font-normal text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="4" class="p-8 text-center text-brand-interface-gray font-mono text-xs uppercase tracking-widest">
              Memuat data dari Supabase...
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td colspan="4" class="p-8 text-center flex flex-col items-center justify-center">
              <Database class="w-8 h-8 text-brand-interface-gray opacity-50 mb-3" />
              <span class="text-brand-interface-gray font-mono text-[10px] uppercase tracking-widest">Database Kosong. Gunakan tombol Suntik Data.</span>
            </td>
          </tr>
          <tr v-for="(product, index) in products" :key="product.id" class="border-b border-brand-primary/5 hover:bg-brand-surface-lowest transition-colors" :class="{'border-b-0': index === products.length - 1}">
            <td class="p-4">
              <div class="font-display text-sm tracking-wider uppercase text-brand-primary">{{ product.name }}</div>
              <div class="font-mono text-[9px] tracking-widest text-brand-interface-gray mt-1">{{ product.subtitle || 'No subtitle' }}</div>
            </td>
            <td class="p-4">
              <span class="px-2 py-1 bg-brand-primary/5 text-brand-primary text-[9px] font-mono tracking-widest uppercase border border-brand-primary/10">
                {{ product.category }}
              </span>
            </td>
            <td class="p-4">
              <span v-if="product.isNew" class="text-brand-secondary text-[10px] font-mono tracking-widest uppercase">Baru</span>
              <span v-else class="text-brand-interface-gray text-[10px] font-mono tracking-widest uppercase">Reguler</span>
            </td>
            <td class="p-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="openEditModal(product)" class="p-2 text-brand-interface-gray hover:text-brand-primary transition-colors"><Edit class="w-4 h-4" /></button>
                <button @click="deleteProduct(product.id)" class="p-2 text-brand-interface-gray hover:text-red-400 transition-colors"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-brand-deep-black/80 backdrop-blur-sm flex justify-end">
      <div class="w-full md:w-[500px] bg-brand-surface h-full border-l border-brand-primary/10 flex flex-col shadow-2xl animate-slide-left">
        
        <div class="flex justify-between items-center p-6 border-b border-brand-primary/10">
          <h2 class="font-display text-xl uppercase tracking-widest text-brand-primary">{{ isEditMode ? 'Edit Produk' : 'Tambah Produk' }}</h2>
          <button @click="closeModal" class="text-brand-interface-gray hover:text-brand-primary transition-colors"><X class="w-5 h-5" /></button>
        </div>

        <div class="flex-grow overflow-y-auto p-6">
          <form @submit.prevent="saveProduct" class="flex flex-col gap-6">
            
            <div>
              <label class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mb-2 block">Nama Parfum</label>
              <input required v-model="form.name" type="text" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" />
            </div>

            <div>
              <label class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mb-2 block">Kategori</label>
              <select required v-model="form.category_id" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors appearance-none">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mb-2 block">Subtitle (Singkat)</label>
              <input v-model="form.subtitle" type="text" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" placeholder="Cth: ALDEHYDES / BLACK TEA" />
            </div>

            <div>
              <label class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mb-2 block">Deskripsi Lengkap</label>
              <textarea required v-model="form.description" rows="4" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors resize-none"></textarea>
            </div>

            <div class="grid grid-cols-3 gap-4 border-y border-brand-primary/10 py-6">
              <div class="col-span-3"><label class="font-mono text-[10px] tracking-widest text-brand-secondary uppercase block">Harga Varian Decant</label></div>
              <div>
                <label class="font-mono text-[9px] tracking-widest text-brand-interface-gray uppercase mb-2 block">2 ML (Rp)</label>
                <input required v-model="form.price_2ml" type="number" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-mono text-sm py-2 px-3 focus:outline-none focus:border-brand-secondary transition-colors" />
              </div>
              <div>
                <label class="font-mono text-[9px] tracking-widest text-brand-interface-gray uppercase mb-2 block">5 ML (Rp)</label>
                <input required v-model="form.price_5ml" type="number" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-mono text-sm py-2 px-3 focus:outline-none focus:border-brand-secondary transition-colors" />
              </div>
              <div>
                <label class="font-mono text-[9px] tracking-widest text-brand-interface-gray uppercase mb-2 block">10 ML (Rp)</label>
                <input required v-model="form.price_10ml" type="number" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-mono text-sm py-2 px-3 focus:outline-none focus:border-brand-secondary transition-colors" />
              </div>
            </div>

            <div class="flex items-center gap-3">
              <input v-model="form.is_new" type="checkbox" id="is_new" class="w-4 h-4 accent-brand-secondary bg-brand-deep-black border-brand-primary/20" />
              <label for="is_new" class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase cursor-pointer">Tandai sebagai Produk Baru</label>
            </div>

          </form>
        </div>

        <div class="p-6 border-t border-brand-primary/10 bg-brand-surface-lowest">
          <button @click="saveProduct" :disabled="formLoading" class="w-full flex items-center justify-center gap-2 h-12 bg-brand-primary text-brand-on-primary font-mono text-[10px] uppercase tracking-widest hover:bg-brand-secondary hover:text-brand-on-secondary transition-colors disabled:opacity-50">
            {{ formLoading ? 'Menyimpan...' : 'Simpan Produk' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-slide-left {
  animation: slideLeft 0.3s ease-out forwards;
}

@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
