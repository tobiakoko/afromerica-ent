import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: 'USER' | 'ADMIN'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  setUser: (user: User | null) => void
  clearUser: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'ADMIN',
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        }),

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return state
          const updatedUser = { ...state.user, ...updates }
          return {
            user: updatedUser,
            isAuthenticated: true,
            isAdmin: updatedUser.role === 'ADMIN',
          }
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

/*
  Auth Store - Client-side authentication state management using Zustand

  This store complements NextAuth.js for client-side state:
  - NextAuth handles server-side session management
  - This store provides reactive client-side auth state

  Usage:
    const { user, isAuthenticated, isAdmin, setUser } = useAuthStore()

  Note: Sync this store with NextAuth session data in your auth context/provider
*/