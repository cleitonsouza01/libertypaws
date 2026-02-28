import { createBrowserClient } from '@supabase/ssr'

// Placeholder values allow SSG prerendering to succeed when env vars
// are not set at build time. The client is only used inside useEffect
// (browser-only), so these placeholders are never hit at runtime.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
