import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// The user named it PUBLISHABLE_KEY instead of ANON_KEY
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[SYS_LOG] Supabase credentials are missing. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
