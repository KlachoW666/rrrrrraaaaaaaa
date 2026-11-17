import Image from "next/image"
import Link from "next/link"
import type { CaseItem } from "@/lib/data"
import { formatCoins, caseAccent } from "@/lib/data"
import { Coin } from "@/components/coin"

const tagStyles: Record<string, string> = {
  new: "border border-primary/60 bg-primary/10 text-primary",
  hot: "bg-destructive text-white",
  limited: "bg-primary text-primary-foreground",
}

const tagLabels: Record<string, string> = {
  new: "NEW",
  hot: "HOT",
  limited: "LIMITED",
}

export function CaseCard({ item }: { item: CaseItem }) {
  const hasStock = typeof item.left === "number" && typeof item.total === "number"
  const pct = hasStock ? Math.round((item.left! / item.total!) * 100) : 0
  const accent = caseAccent(item.image)

  return (
    <Link
      href={`/cases/${item.slug}`}
      className="group relative flex flex-col rounded-3xl border border-white/[0.06] bg-card p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:border-white/15"
    >
      {item.tag && (
        <span
          className={
            "absolute left-3 top-3 z-10 rounded-lg px-2.5 py-1 text-[10px] font-extrabold tracking-wide " +
            tagStyles[item.tag]
          }
        >
          {tagLabels[item.tag]}
        </span>
      )}

      <div className="relative flex h-44 w-full items-center justify-center">
        <div
          className="absolute h-32 w-32 rounded-full opacity-40 blur-2xl transition-all duration-300 group-hover:opacity-70"
          style={{ backgroundColor: accent }}
        />
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={190}
          height={190}
          className="relative h-40 w-40 object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {hasStock && (
        <div className="mb-2 w-full px-1">
          <div className="mb-1.5 text-xs text-muted-foreground">
            Осталось <span className="font-bold text-primary">{formatCoins(item.left!)}</span> из{" "}
            {formatCoins(item.total!)}
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <h3 className="mt-auto text-sm font-bold text-foreground">{item.name}</h3>

      <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-background/80 px-5 py-2.5 text-sm font-bold text-foreground ring-1 ring-white/[0.06] transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-transparent">
        {formatCoins(item.price)}
        <Coin className="h-4 w-4" />
      </div>
    </Link>
  )
}
