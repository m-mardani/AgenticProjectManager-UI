import React, { createContext, useContext, useState } from 'react'

interface UIContextType {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  locale: 'fa' | 'en'
  toggleLocale: () => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIContextProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [locale, setLocale] = useState<'fa' | 'en'>('fa')
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev)
  const toggleLocale = () => setLocale(prev => (prev === 'fa' ? 'en' : 'fa'))
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <UIContext.Provider value={{ sidebarCollapsed, toggleSidebar, locale, toggleLocale, theme, toggleTheme }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUIContext() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUIContext must be used inside UIContextProvider')
  return ctx
}
