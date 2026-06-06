import { defineStore } from 'pinia'
import { supabase } from '../plugins/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        
        this.user = user
        this.isAuthenticated = !!user
        if (user) await this.fetchUserProfile()
      } catch (err) {
        this.user = null
        this.isAuthenticated = false
        console.warn('[SYS_LOG] User not authenticated.', err)
      }
    },
    
    async fetchUserProfile() {
      if (!this.user) return
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', this.user.id)
          .single()
        
        if (data) {
          this.role = data.role
        }
      } catch (err) {
        console.error('Error fetching user profile:', err)
      }
    },

    async checkSession() {
      this.loading = true
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          this.user = session.user
          this.isAuthenticated = true
          await this.fetchUserProfile()
        } else {
          this.user = null
          this.role = null
          this.isAuthenticated = false
        }
      } catch (err) {
        console.error('Session check failed', err)
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })
        
        if (error) throw error
        
        this.user = data.user
        this.isAuthenticated = true
        await this.fetchUserProfile()
      } catch (err) {
        this.error = err.message || 'Authentication failed'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async loginWithGoogle() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`
          }
        })
        if (error) throw error
        // Note: OAuth redirect will reload the page, so checkSession will handle fetching the profile
      } catch (err) {
        this.error = err.message || 'Google Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name
            }
          }
        })
        
        if (error) throw error
        this.user = data.user
        this.isAuthenticated = true
        await this.fetchUserProfile()
      } catch (err) {
        this.error = err.message || 'Registration failed'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      } catch (err) {
        console.error('Logout error', err)
      } finally {
        this.user = null
        this.role = null
        this.isAuthenticated = false
      }
    },

    async resetPassword(email) {
      this.loading = true
      this.error = null
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          // Adjust the redirect URL according to your production deployment later
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
      } catch (err) {
        this.error = err.message || 'Password reset failed'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    clearError() {
      this.error = null
    }
  }
})
