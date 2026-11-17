"use client"

import { Search, ChevronDown, SlidersHorizontal } from "lucide-react"
import { Coin } from "@/components/coin"

export function FilterBar({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (v: string) => void
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-card/60 p-3">
        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl bg-background/60 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Название"
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-background/60 px-3 py-2.5">
          <input
            placeholder="Цена от"
            className="w-20 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <Coin className="h-4 w-4" />
        </div>
        <span className="text-muted-foreground">-</span>
        <div className="flex items-center gap-2 rounded-xl bg-background/60 px-3 py-2.5">
          <input
            placeholder="Цена до"
            className="w-20 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <Coin className="h-4 w-4" />
        </div>

        <button className="flex items-center gap-6 rounded-xl bg-background/60 px-4 py-2.5 text-sm">
          <span>
            <span className="text-muted-foreground">Серия: </span>
            <span className="font-semibold">все</span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="flex items-center gap-6 rounded-xl bg-background/60 px-4 py-2.5 text-sm">
          <span>
            <span className="text-muted-foreground">Сорт: </span>
            <span className="font-semibold">все</span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          aria-label="Фильтры"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl bg-background/60 text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
