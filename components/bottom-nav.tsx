"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, ChevronsUp, X, Flame, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { label: "Кейсы", href: "/", Icon: Briefcase },
  { label: "Апгрейдер", href: "/upgrader", Icon: ChevronsUp },
  { label: "Замесы", href: "/crate-pvp", Icon: X },
  { label: "Топ дропов", href: "/top-drops", Icon: Flame },
  { label: "Розыгрыши", href: "/giveaways", Icon: Trophy },
  { label: "Профиль", href: "/profile", Icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-6">
        {items.map(({ label, href, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
