"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { UIProvider, type SessionUser } from "@/components/ui-provider"
import { LiveDrops } from "@/components/live-drops"
import { SiteHeader } from "@/components/site-header"
import { StatsBar } from "@/components/stats-bar"
import { SiteFooter } from "@/components/site-footer"
import { BottomNav } from "@/components/bottom-nav"
import { AuthModal } from "@/components/auth-modal"
import { SupportFab } from "@/components/support-fab"

export function AppShell({ children, initialUser = null }: { children: ReactNode; initialUser?: SessionUser }) {
  const pathname = usePathname()

  // Admin panel has its own dedicated layout — no public site chrome.
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>
  }

  return (
    <UIProvider initialUser={initialUser}>
      <LiveDrops />
      <div className="flex min-h-screen flex-col bg-background lg:pl-[165px]">
        <SiteHeader />
        <main className="flex-1 pb-6 pt-6">{children}</main>
        <StatsBar />
        <SiteFooter />
      </div>
      <BottomNav />
      <AuthModal />
      <SupportFab />
    </UIProvider>
  )
}
