"use client"

import { Briefcase, ChevronsUp, ArrowUp } from "lucide-react"
import Image from "next/image"
import { siteStats, formatCoins } from "@/lib/data"

export function StatsBar() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="flex items-center gap-6 overflow-x-auto rounded-2xl border border-border/60 bg-card/60 px-5 py-4 scrollbar-hide">
        <Stat Icon={Briefcase} label="Открыто кейсов" value={formatCoins(siteStats.casesOpened)} />
        <Stat Icon={ChevronsUp} label="Апгрейдов" value={formatCoins(siteStats.upgrades)} />
        <div className="flex shrink-0 items-center gap-3">
          <Image src="/hazmat-logo.png" alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
          <div className="leading-tight">
            <div className="text-xs text-muted-foreground">Выживших</div>
            <div className="font-bold">{formatCoins(siteStats.kabans)}</div>
          </div>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Наверх"
          className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function Stat({
  Icon,
  label,
  value,
}: {
  Icon: typeof Briefcase
  label: string
  value: string
}) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <Icon className="h-6 w-6 text-primary" />
      <div className="leading-tight">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold">{value}</div>
      </div>
    </div>
  )
}
