"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, X, ChevronsUp, Flame, Trophy, Volume2, VolumeX, Wallet, Shield, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/components/ui-provider"
import { Coin } from "@/components/coin"
import { formatCoins } from "@/lib/data"

const nav = [
  { label: "Кейсы", href: "/", Icon: Briefcase },
  { label: "Замесы", href: "/crate-pvp", Icon: X },
  { label: "Апгрейдер", href: "/upgrader", Icon: ChevronsUp },
  { label: "Топ дропов", href: "/top-drops", Icon: Flame },
  { label: "Розыгрыши", href: "/giveaways", Icon: Trophy },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { openAuth, loggedIn, user, logout, muted, toggleMuted, balance } = useUI()
  const isStaff = user?.role === "owner" || user?.role === "admin"

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative">
            <Image
              src="/hazmat-logo.png"
              alt="HAZMAT.GG"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="absolute -left-1 -top-2 flex items-center gap-0.5 rounded bg-primary px-1 py-px text-[8px] font-bold leading-none text-primary-foreground">
              <span className="h-1 w-1 rounded-full bg-primary-foreground" />
              158 ONLINE
            </span>
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight sm:block">
            HAZMAT<span className="text-primary">.GG</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 items-center gap-1">
          {nav.map(({ label, href, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-primary")} />
                <span className={cn(active ? "inline" : "hidden lg:inline")}>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        {loggedIn ? (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/wallet"
              className="flex items-center gap-2 rounded-xl bg-secondary py-1.5 pl-3 pr-1.5 text-sm font-bold"
            >
              <span className="flex items-center gap-1">
                {formatCoins(balance)} <Coin className="h-4 w-4" />
              </span>
              <span className="hidden items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-primary-foreground sm:flex">
                <Wallet className="h-4 w-4" /> Кошелек
              </span>
            </Link>
            {isStaff && (
              <Link
                href="/admin"
                aria-label="Админка"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary hover:bg-primary/30"
              >
                <Shield className="h-5 w-5" />
              </Link>
            )}
            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-chart-3/80 text-sm font-bold text-white"
            >
              {user?.avatar ? (
                <Image src={user.avatar || "/placeholder.svg"} alt="" width={40} height={40} className="h-full w-full object-cover" />
              ) : (
                (user?.username ?? "U").charAt(0).toUpperCase()
              )}
            </Link>
            <button
              onClick={logout}
              aria-label="Выйти"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={openAuth}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_0_24px_-6px_var(--color-primary)] transition-transform hover:scale-[1.03]"
            >
              Войти
            </button>
            <button
              onClick={toggleMuted}
              aria-label={muted ? "Включить звук" : "Выключить звук"}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
