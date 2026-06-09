<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../../plugins/supabase'
import { Plus, Database, Edit, Trash2, X, Tags } from 'lucide-vue-next'

const categories = ref([])
const loading = ref(true)

const showModal = ref(false)
const formLoading = ref(false)

// Form State
const isEditMode = ref(false)
const editingCategoryId = ref(null)
const form = ref({
  name: ''
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false })
    if (error) throw error
    categories.value = data || []
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

const openModal = () => {
  isEditMode.value = false
  editingCategoryId.value = null
  form.value = { name: '' }
  showModal.value = true
}

const openEditModal = (cat) => {
  isEditMode.value = true
  editingCategoryId.value = cat.id
  form.value = { name: cat.name }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCategory = async () => {
  if (!form.value.name || form.value.name.trim() === '') {
    alert('Nama kategori tidak boleh kosong!')
    return
  }

  formLoading.value = true
  try {
    const name = form.value.name.trim()
    const slug = name.toLowerCase().replace(/ /g, '-')

    if (isEditMode.value) {
      const { error } = await supabase.from('categories')
        .update({ name, slug })
        .eq('id', editingCategoryId.value)
      if (error) throw error
    } else {
      const { error } = await supabase.from('categories')
        .insert({ name, slug })
      if (error) throw error
    }

    closeModal()
    await fetchCategories()
  } catch (err) {
    alert('Gagal menyimpan kategori: ' + err.message)
    console.error(err)
  } finally {
    formLoading.value = false
  }
}

const deleteCategory = async (cat) => {
  if (confirm(`Yakin ingin menghapus kategori "${cat.name}"?\nPerhatian: Menghapus kategori dapat mempengaruhi produk yang terkait dengannya.`)) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', cat.id)
      if (error) throw error
      await fetchCategories()
    } catch (err) {
      alert('Gagal menghapus kategori: ' + err.message)
      console.error(err)
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="font-display text-3xl font-bold uppercase tracking-wide text-brand-primary">Manajemen Kategori</h1>
        <p class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mt-1">Mengelola kategori jenis parfum</p>
      </div>

      <div class="flex gap-3">
        <button @click="openModal" class="flex items-center gap-2 px-4 py-2 bg-brand-secondary text-brand-on-secondary font-mono text-[10px] uppercase tracking-widest hover:bg-brand-secondary/90 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <Plus class="w-3 h-3" />
          Tambah Kategori
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-brand-surface border border-brand-primary/10 overflow-x-auto">
      <table class="w-full text-left font-body text-sm">
        <thead class="bg-brand-surface-lowest border-b border-brand-primary/10 font-mono text-[10px] tracking-widest uppercase text-brand-interface-gray">
          <tr>
            <th class="p-4 font-normal">Nama Kategori</th>
            <th class="p-4 font-normal">Slug</th>
            <th class="p-4 font-normal text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="3" class="p-8 text-center text-brand-interface-gray font-mono text-xs uppercase tracking-widest">
              Memuat data dari Supabase...
            </td>
          </tr>
          <tr v-else-if="categories.length === 0">
            <td colspan="3" class="p-8 text-center flex flex-col items-center justify-center">
              <Tags class="w-8 h-8 text-brand-interface-gray opacity-50 mb-3" />
              <span class="text-brand-interface-gray font-mono text-[10px] uppercase tracking-widest">Belum ada kategori.</span>
            </td>
          </tr>
          <tr v-for="(cat, index) in categories" :key="cat.id" class="border-b border-brand-primary/5 hover:bg-brand-surface-lowest transition-colors" :class="{'border-b-0': index === categories.length - 1}">
            <td class="p-4">
              <div class="font-display text-sm tracking-wider uppercase text-brand-primary">{{ cat.name }}</div>
            </td>
            <td class="p-4 text-brand-interface-gray font-mono text-xs">
              {{ cat.slug }}
            </td>
            <td class="p-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="openEditModal(cat)" class="p-2 text-brand-interface-gray hover:text-brand-primary transition-colors"><Edit class="w-4 h-4" /></button>
                <button @click="deleteCategory(cat)" class="p-2 text-brand-interface-gray hover:text-red-400 transition-colors"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-brand-deep-black/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div class="w-full max-w-md bg-brand-surface border border-brand-primary/10 shadow-2xl animate-fade-in flex flex-col">
        
        <div class="flex justify-between items-center p-6 border-b border-brand-primary/10">
          <h2 class="font-display text-xl uppercase tracking-widest text-brand-primary">{{ isEditMode ? 'Edit Kategori' : 'Tambah Kategori' }}</h2>
          <button @click="closeModal" class="text-brand-interface-gray hover:text-brand-primary transition-colors"><X class="w-5 h-5" /></button>
        </div>

        <div class="p-6">
          <form @submit.prevent="saveCategory" class="flex flex-col gap-6">
            <div>
              <label class="font-mono text-[10px] tracking-widest text-brand-interface-gray uppercase mb-2 block">Nama Kategori</label>
              <input required v-model="form.name" type="text" class="w-full bg-brand-deep-black border border-brand-primary/20 text-brand-on-surface font-body text-sm py-3 px-4 focus:outline-none focus:border-brand-secondary transition-colors" placeholder="Cth: Woody, Floral" />
            </div>
            
            <button type="submit" :disabled="formLoading" class="w-full flex items-center justify-center gap-2 h-12 bg-brand-primary text-brand-on-primary font-mono text-[10px] uppercase tracking-widest hover:bg-brand-secondary hover:text-brand-on-secondary transition-colors disabled:opacity-50 mt-4">
              {{ formLoading ? 'Menyimpan...' : 'Simpan Kategori' }}
            </button>
          </form>
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
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
