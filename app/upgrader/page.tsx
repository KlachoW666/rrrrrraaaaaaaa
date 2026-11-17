"use client"

import { useMemo, useState } from "react"
import { ChevronsUp, ChevronDown, Info, Zap, Search } from "lucide-react"
import { skins, formatCoins } from "@/lib/data"
import { Coin } from "@/components/coin"
import { ItemCard } from "@/components/item-card"
import { cn } from "@/lib/utils"

const multipliers = ["X2", "X4", "X5"]
const quickBets = [100, 250, 500, 1000]

export default function UpgraderPage() {
  const [bet, setBet] = useState(1)
  const [target, setTarget] = useState<(typeof skins)[number] | null>(null)
  const [query, setQuery] = useState("")
  const [fast, setFast] = useState(false)

  // Success chance = bet value / target value (capped), classic upgrader math.
  const chance = useMemo(() => {
    if (!target || target.price <= 0) return 0
    return Math.min(95, (bet / target.price) * 100)
  }, [bet, target])

  const filtered = useMemo(() => {
    const list = query
      ? skins.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      : skins
    return [...list].sort((a, b) => b.price - a.price)
  }, [query])

  const circumference = 2 * Math.PI * 120
  const dash = (chance / 100) * circumference

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Апгрейдер</h1>
        <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" /> Хоткеи
        </button>
      </div>

      {/* Gauge */}
      <div className="rounded-2xl border border-white/5 bg-card/50 p-6">
        <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
          <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
            <circle cx="130" cy="130" r="120" fill="none" stroke="var(--color-secondary)" strokeWidth="6" />
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <ChevronsUp className="mb-3 h-7 w-7 text-primary" />
            <span className="text-sm text-muted-foreground">Вероятность успеха</span>
            <span className="text-4xl font-black text-primary">{chance.toFixed(2)}%</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-16 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_0_28px_-8px_var(--color-primary)] transition-transform hover:scale-[1.02] disabled:opacity-50"
            disabled={!target}
          >
            <ChevronsUp className="h-4 w-4" /> Апгрейд
          </button>
        </div>

        {/* Controls */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <div className="mb-2 text-sm text-muted-foreground">Размер ставки</div>
            <div className="flex items-center gap-2 rounded-xl bg-input p-1.5">
              <Coin className="ml-2 h-4 w-4" />
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent px-1 text-sm font-semibold focus:outline-none"
              />
              {["1/2", "X2", "Макс"].map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    if (b === "1/2") setBet((v) => Math.max(1, Math.round(v / 2)))
                    if (b === "X2") setBet((v) => v * 2)
                    if (b === "Макс") setBet(1000)
                  }}
                  className="shrink-0 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold hover:bg-secondary/70"
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {quickBets.map((q) => (
                <button
                  key={q}
                  onClick={() => setBet(q)}
                  className="flex items-center justify-center gap-1 rounded-lg bg-input py-2 text-xs font-semibold hover:bg-secondary"
                >
                  {q} <Coin className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm text-muted-foreground">Выберите множитель</div>
            <div className="flex items-center gap-2">
              {multipliers.map((m) => (
                <button
                  key={m}
                  className="rounded-lg bg-input px-4 py-2.5 text-sm font-bold hover:bg-secondary"
                >
                  {m}
                </button>
              ))}
              <button className="flex-1 rounded-lg bg-input px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary">
                Ручной коэф.
              </button>
            </div>
            <button
              onClick={() => setFast((f) => !f)}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground"
            >
              <Zap className={cn("h-4 w-4", fast && "text-primary")} /> Быстрый режим
              <span className={cn("relative h-5 w-9 rounded-full", fast ? "bg-primary" : "bg-secondary")}>
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
                    fast ? "left-[18px]" : "left-0.5",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Target picker */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-extrabold">Желаемый предмет</h2>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl bg-input px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Название"
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-3 rounded-xl bg-input px-4 py-2.5 text-sm">
            Цена: по убыванию <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selected={target?.id === item.id}
              onClick={() => setTarget(item)}
            />
          ))}
        </div>
      </div>

      {target && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Цель: <span className="font-bold text-foreground">{target.name}</span> —{" "}
          {formatCoins(target.price)} <Coin className="inline h-3.5 w-3.5 align-text-bottom" />
        </p>
      )}
    </div>
  )
}
