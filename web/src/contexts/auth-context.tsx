'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient, User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  locale: string
  role?: 'admin' | 'user'
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  updateProfile: (data: Partial<Pick<AuthUser, 'fullName' | 'locale'>>) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextType | null>(null)

async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
  role?: 'admin' | 'user'
): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, locale')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    email: data.email ?? '',
    fullName: data.full_name ?? '',
    avatarUrl: data.avatar_url ?? null,
    locale: data.locale ?? 'en',
    role,
  }
}

function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
    avatarUrl: user.user_metadata?.avatar_url ?? null,
    locale: user.user_metadata?.locale ?? 'en',
    role: (user.app_metadata?.role as 'admin' | 'user') ?? 'user',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabaseRef = useRef<SupabaseClient>(null!)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

  useEffect(() => {
    // Get initial session
    async function init() {
      const { data: { user: sbUser } } = await supabase.auth.getUser()
      if (sbUser) {
        const role = (sbUser.app_metadata?.role as 'admin' | 'user') ?? 'user'
        const profile = await fetchProfile(supabase, sbUser.id, role)
        setUser(profile ?? mapSupabaseUser(sbUser))
      }
      setIsLoading(false)
    }
    init()

    // Listen for auth state changes
    // IMPORTANT: Do NOT await Supabase queries inside this callback.
    // The Supabase client holds an internal lock during onAuthStateChange
    // and making queries (which call getSession()) causes a deadlock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session?.user) {
            // Set user immediately from auth metadata (no await, no deadlock)
            setUser(mapSupabaseUser(session.user))
            // Fetch full profile in background, outside the lock
            const userId = session.user.id
            const userRole = (session.user.app_metadata?.role as 'admin' | 'user') ?? 'user'
            setTimeout(async () => {
              const profile = await fetchProfile(supabase, userId, userRole)
              if (profile) setUser(profile)
            }, 0)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return { success: false, error: 'email_not_confirmed' }
        }
        return { success: false, error: 'invalid_credentials' }
      }
      return { success: true }
    },
    [supabase]
  )

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/en/auth/callback`,
        },
      })
      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          return { success: false, error: 'email_exists' }
        }
        return { success: false, error: error.message }
      }
      return { success: true }
    },
    [supabase]
  )

  const signInWithGoogle = useCallback(async () => {
    const locale = window.location.pathname.split('/')[1] || 'en'
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    })
    // Browser navigates away — this function never resolves to the caller
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    // Listener handles clearing state
  }, [supabase])

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      const locale = window.location.pathname.split('/')[1] || 'en'
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/callback?next=/auth/reset-password`,
      })
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    },
    [supabase]
  )

  const updatePassword = useCallback(
    async (password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    },
    [supabase]
  )

  const updateProfile = useCallback(
    async (data: Partial<Pick<AuthUser, 'fullName' | 'locale'>>): Promise<AuthResult> => {
      const { data: { user: sbUser } } = await supabase.auth.getUser()
      if (!sbUser) {
        return { success: false, error: 'not_authenticated' }
      }

      // Update profiles table
      const profileUpdate: Record<string, string> = {}
      if (data.fullName !== undefined) profileUpdate.full_name = data.fullName
      if (data.locale !== undefined) profileUpdate.locale = data.locale

      if (Object.keys(profileUpdate).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', sbUser.id)

        if (profileError) {
          return { success: false, error: profileError.message }
        }
      }

      // Sync metadata to auth.users
      const metadata: Record<string, string> = {}
      if (data.fullName !== undefined) metadata.full_name = data.fullName
      if (data.locale !== undefined) metadata.locale = data.locale

      if (Object.keys(metadata).length > 0) {
        await supabase.auth.updateUser({ data: metadata })
      }

      // Re-fetch profile to update local state
      const currentRole = (sbUser.app_metadata?.role as 'admin' | 'user') ?? 'user'
      const profile = await fetchProfile(supabase, sbUser.id, currentRole)
      if (profile) setUser(profile)

      return { success: true }
    },
    [supabase]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
