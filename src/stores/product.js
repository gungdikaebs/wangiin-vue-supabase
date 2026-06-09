import { defineStore } from 'pinia'
import { productService } from '../services/productService'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    featuredProducts: [],
    currentProduct: null,
    categories: [],
    brands: [],
    classifications: ['All', 'Local', 'Designer', 'Niche', 'Timteng'],
    
    // Filters & Pagination
    searchQuery: '',
    currentCategory: 'All',
    currentBrand: 'All',
    currentClassification: 'All',
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    
    // Status
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await productService.getProducts({
          category: this.currentCategory,
          brand: this.currentBrand,
          classification: this.currentClassification,
          search: this.searchQuery,
          page: this.currentPage,
          limit: 6
        })
        
        this.products = response.data
        this.totalPages = response.meta.lastPage
        this.totalItems = response.meta.total
      } catch (err) {
        this.error = err.message || 'Gagal mengambil data produk'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    
    async fetchProductById(id) {
      this.loading = true
      this.error = null
      this.currentProduct = null
      
      try {
        this.currentProduct = await productService.getProductById(id)
      } catch (err) {
        this.error = err.message || 'Produk tidak ditemukan'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    
    async fetchFeaturedProducts() {
      this.loading = true
      try {
        this.featuredProducts = await productService.getFeaturedProducts()
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    
    async loadCategories() {
      this.categories = await productService.getCategories()
    },

    async loadBrands() {
      this.brands = await productService.getBrands()
    },
    
    setCategory(category) {
      this.currentCategory = category
      this.currentPage = 1 // reset to first page when filtering
      this.fetchProducts()
    },

    setBrand(brand) {
      this.currentBrand = brand
      this.currentPage = 1
      this.fetchProducts()
    },

    setClassification(cls) {
      this.currentClassification = cls
      this.currentPage = 1
      this.fetchProducts()
    },
    
    setSearchQuery(query) {
      this.searchQuery = query
      this.currentPage = 1
      this.fetchProducts()
    },
    
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchProducts()
      }
    }
  }
})
