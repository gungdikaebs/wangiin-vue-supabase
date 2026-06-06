import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../plugins/supabase'
import LandingPage from '../views/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/collection',
      name: 'collection',
      component: () => import('../views/catalog/Collection.vue')
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/catalog/ProductDetail.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/checkout/Checkout.vue')
    },
    {
      path: '/checkout/success',
      name: 'checkout-success',
      component: () => import('../views/checkout/Success.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPassword.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardIndex.vue'),
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Ensure we have the latest session from Supabase before checking auth
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session
  
  // Keep the store in sync with the session we just fetched
  if (session) {
    authStore.user = session.user
    authStore.isAuthenticated = true
  } else {
    authStore.user = null
    authStore.isAuthenticated = false
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requiresAuth && !isAuthenticated) {
    // Requires login, redirect to login page
    next('/login')
  } else if (guestOnly && isAuthenticated) {
    // Is authenticated but trying to access guest only route (like login), redirect to dashboard
    next('/dashboard')
  } else {
    // Proceed as normal
    next()
  }
})

export default router
