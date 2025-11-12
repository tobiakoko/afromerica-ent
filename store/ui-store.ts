import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  theme: 'light' | 'dark' | 'system'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: 'system',

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
      // Only persist theme and sidebar state, not mobile menu state
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
)

/*
  UI Store - Client-side UI state management using Zustand

  This store manages application-wide UI state:
  - Sidebar visibility (desktop)
  - Mobile menu state
  - Theme preference (light/dark/system)

  Usage:
    const { sidebarOpen, toggleSidebar, theme, setTheme } = useUIStore()

  Note: Works with next-themes for theme management
  The theme state here can be synced with next-themes ThemeProvider
*/