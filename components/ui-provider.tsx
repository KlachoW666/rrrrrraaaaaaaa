"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type SessionUser = {
  id: number
  username: string | null
  avatar: string | null
  role: string
  balance: number
} | null

type UIContextValue = {
  authOpen: boolean
  openAuth: () => void
  closeAuth: () => void
  user: SessionUser
  loggedIn: boolean
  login: () => void
  logout: () => void
  muted: boolean
  toggleMuted: () => void
  balance: number
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children, initialUser = null }: { children: ReactNode; initialUser?: SessionUser }) {
  const [authOpen, setAuthOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const user = initialUser

  const value: UIContextValue = {
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => setAuthOpen(false),
    user,
    loggedIn: !!user,
    // Real login is Steam OpenID; the modal button links to /api/auth/steam.
    login: () => setAuthOpen(false),
    logout: () => {
      window.location.href = "/api/auth/logout"
    },
    muted,
    toggleMuted: () => setMuted((m) => !m),
    balance: user?.balance ?? 0,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error("useUI must be used within UIProvider")
  return ctx
}
