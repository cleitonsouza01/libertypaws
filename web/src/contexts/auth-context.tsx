'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  locale: string
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  updateProfile: (data: Partial<Pick<AuthUser, 'fullName' | 'locale'>>) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'libertypaws_auth_user'

const MOCK_USER: AuthUser = {
  id: 'mock-user-001',
  email: 'demo@libertypaws.com',
  fullName: 'Demo User',
  avatarUrl: null,
  locale: 'en',
}

const MOCK_GOOGLE_USER: AuthUser = {
  id: 'mock-google-001',
  email: 'demo.google@gmail.com',
  fullName: 'Google Demo User',
  avatarUrl: null,
  locale: 'en',
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
    setIsLoading(false)
  }, [])

  const persistUser = useCallback((u: AuthUser | null) => {
    setUser(u)
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const signIn = useCallback(
    async (email: string, _password: string): Promise<AuthResult> => {
      await delay(1000)
      if (email === 'error@test.com') {
        return { success: false, error: 'invalid_credentials' }
      }
      const loggedUser: AuthUser = {
        ...MOCK_USER,
        email,
        fullName: email.split('@')[0].replace(/[._]/g, ' '),
      }
      persistUser(loggedUser)
      return { success: true }
    },
    [persistUser]
  )

  const signUp = useCallback(
    async (email: string, _password: string, fullName: string): Promise<AuthResult> => {
      await delay(1000)
      if (email === 'error@test.com') {
        return { success: false, error: 'email_exists' }
      }
      // In mock mode we don't auto-login on signup (need email confirmation)
      return { success: true }
    },
    []
  )

  const signInWithGoogle = useCallback(async () => {
    await delay(1000)
    persistUser(MOCK_GOOGLE_USER)
  }, [persistUser])

  const signOut = useCallback(async () => {
    persistUser(null)
  }, [persistUser])

  const resetPassword = useCallback(async (_email: string): Promise<AuthResult> => {
    await delay(1000)
    return { success: true }
  }, [])

  const updatePassword = useCallback(async (_password: string): Promise<AuthResult> => {
    await delay(1000)
    return { success: true }
  }, [])

  const updateProfile = useCallback(
    async (data: Partial<Pick<AuthUser, 'fullName' | 'locale'>>): Promise<AuthResult> => {
      await delay(500)
      if (user) {
        persistUser({ ...user, ...data })
      }
      return { success: true }
    },
    [user, persistUser]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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
