"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderTree,
  Package,
  LifeBuoy,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react"
import type { Role } from "@/lib/auth"

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  supportOnly?: boolean
}

const items: NavItem[] = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/cases", label: "Кейсы", icon: Package },
  { href: "/admin/support", label: "Тех. поддержка", icon: LifeBuoy, supportOnly: true },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/roles", label: "Роли", icon: ShieldCheck },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
]

export function AdminSidebar({ role, username }: { role: Role; username: string | null }) {
  const pathname = usePathname()
  const isSupportAdmin = role === "admin"

  // Support-only admins see just the dashboard + support.
  const visible = items.filter((i) => {
    if (isSupportAdmin) return i.href === "/admin/support"
    return true
  })

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/8 bg-card">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
          H
        </div>
        <div className="leading-tight">
          <div className="text-sm font-extrabold">HAZMAT.GG</div>
          <div className="text-[11px] text-muted-foreground">Админ-панель</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {visible.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-white/8 px-3 py-3">
        <div className="px-3 py-1 text-xs text-muted-foreground">
          {username} · <span className="text-primary">{role}</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <ExternalLink className="h-4.5 w-4.5" />
          На сайт
        </Link>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4.5 w-4.5" />
          Выйти
        </a>
      </div>
    </aside>
  )
}
