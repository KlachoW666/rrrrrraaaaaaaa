"use client"

import Image from "next/image"
import type { SkinItem } from "@/lib/data"
import { rarityColor, formatCoins } from "@/lib/data"
import { Coin } from "@/components/coin"
import { cn } from "@/lib/utils"

export function ItemCard({
  item,
  selected,
  onClick,
}: {
  item: SkinItem
  selected?: boolean
  onClick?: () => void
}) {
  const color = rarityColor[item.rarity]

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center overflow-hidden rounded-xl border bg-card/60 p-3 text-center transition-all hover:-translate-y-0.5",
        selected ? "border-primary" : "border-white/5",
      )}
      style={{ boxShadow: `inset 0 2px 0 0 ${color}` }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-40"
        style={{ background: `linear-gradient(to bottom, ${color}22, transparent)` }}
      />
      <div className="relative flex h-20 w-full items-center justify-center">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={80}
          height={80}
          className="h-20 w-20 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]"
        />
      </div>
      <p className="mt-1 line-clamp-1 w-full text-xs text-muted-foreground">{item.name}</p>
      <div className="mt-1 flex items-center gap-1 text-sm font-bold">
        {formatCoins(item.price)}
        <Coin className="h-3.5 w-3.5" />
      </div>
    </button>
  )
}
