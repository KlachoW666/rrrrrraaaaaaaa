"use client"

import { useEffect, useState, useTransition } from "react"
import Image from "next/image"
import {
  Plus,
  Trash2,
  Search,
  X,
  FlaskConical,
  Scale,
  Power,
  Loader2,
} from "lucide-react"
import {
  createCase,
  deleteCase,
  setCaseActive,
  rebalanceCase,
  simulateCase,
} from "@/app/admin/cases/actions"

type CaseRow = {
  id: number
  name: string
  price: string
  imageUrl: string | null
  rtp: string
  tag: string | null
  active: boolean
  categoryId: number | null
  itemCount: number
}

type Category = { id: number; name: string }

type Skin = {
  id: number
  name: string
  image: string | null
  price: string
  rarity: string | null
}

type SimResult = {
  opens: number
  spent: number
  playersWon: number
  netProfit: number
  actualRtp: number
  theoreticalRtp: number
}

const money = (n: number) =>
  n.toLocaleString("ru-RU", { maximumFractionDigits: 2 }) + " ₽"

export function CaseManager({
  cases,
  categories,
}: {
  cases: CaseRow[]
  categories: Category[]
}) {
  const [creating, setCreating] = useState(false)
  const [sim, setSim] = useState<{ id: number; name: string; result?: SimResult } | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <div className="space-y-5">
      <button
        onClick={() => setCreating(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
      >
        <Plus className="h-4 w-4" /> Создать кейс
      </button>

      <div className="grid gap-3">
        {cases.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
            Пока нет кейсов
          </div>
        )}
        {cases.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-white/8 bg-card p-4"
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-secondary">
              {c.imageUrl ? (
                <Image
                  src={c.imageUrl || "/placeholder.svg"}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">нет</span>
              )}
            </div>
            <div className="min-w-40 flex-1">
              <div className="flex items-center gap-2 font-semibold">
                {c.name}
                {!c.active && (
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    выкл
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {money(Number(c.price))} · {c.itemCount} предметов · RTP {Number(c.rtp)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  startTransition(async () => {
                    const result = await simulateCase(c.id, 1000)
                    setSim({ id: c.id, name: c.name, result })
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium hover:bg-secondary"
              >
                <FlaskConical className="h-3.5 w-3.5" /> Симуляция
              </button>
              <button
                onClick={() => startTransition(async () => void (await rebalanceCase(c.id)))}
                title="Пересчитать RTP"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 hover:bg-secondary"
              >
                <Scale className="h-4 w-4" />
              </button>
              <button
                onClick={() => startTransition(async () => void (await setCaseActive(c.id, !c.active)))}
                title="Вкл/выкл"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 hover:bg-secondary"
              >
                <Power className={`h-4 w-4 ${c.active ? "text-primary" : "text-muted-foreground"}`} />
              </button>
              <button
                onClick={() => startTransition(async () => void (await deleteCase(c.id)))}
                title="Удалить"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {creating && (
        <CreateCaseModal
          categories={categories}
          onClose={() => setCreating(false)}
        />
      )}

      {sim && (
        <SimulationModal
          name={sim.name}
          result={sim.result}
          loading={pending}
          onClose={() => setSim(null)}
        />
      )}
    </div>
  )
}

function CreateCaseModal({
  categories,
  onClose,
}: {
  categories: Category[]
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [imageUrl, setImageUrl] = useState("")
  const [tag, setTag] = useState("")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Skin[]>([])
  const [selected, setSelected] = useState<Skin[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    let active = true
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/skins/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (active) setResults(data.skins ?? [])
      } finally {
        if (active) setSearching(false)
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [query])

  const toggle = (s: Skin) => {
    setSelected((prev) =>
      prev.find((x) => x.id === s.id) ? prev.filter((x) => x.id !== s.id) : [...prev, s],
    )
  }

  const submit = () => {
    setError(null)
    startTransition(async () => {
      try {
        await createCase({
          name,
          price: Number(price),
          categoryId: categoryId ? Number(categoryId) : null,
          imageUrl: imageUrl.trim() || null,
          tag: tag || null,
          skinIds: selected.map((s) => s.id),
        })
        onClose()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка")
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">Создать кейс</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Название</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Цена (₽)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="1"
              className="w-full rounded-lg bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Категория</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">— без категории —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Бейдж</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full rounded-lg bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">— нет —</option>
              <option value="new">NEW</option>
              <option value="hot">HOT</option>
              <option value="limited">LIMITED</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-muted-foreground">
              Картинка кейса (URL или PNG)
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... или /images/case.png"
              className="w-full rounded-lg bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Skin picker */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold">
              Предметы <span className="text-muted-foreground">({selected.length} выбрано)</span>
            </label>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск скинов Rust…"
              className="w-full rounded-lg bg-input py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          {selected.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selected.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggle(s)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-2.5 py-1.5 text-xs text-primary"
                >
                  {s.name} · {Number(s.price)}₽ <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
            {searching && (
              <div className="col-span-full flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!searching &&
              results.map((s) => {
                const isSel = !!selected.find((x) => x.id === s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => toggle(s)}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-colors ${
                      isSel
                        ? "border-primary bg-primary/10"
                        : "border-white/8 bg-background hover:bg-secondary"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-secondary">
                      {s.image ? (
                        <Image
                          src={s.image || "/placeholder.svg"}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 object-contain"
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{s.name}</div>
                      <div className="text-primary">{Number(s.price)}₽</div>
                    </div>
                  </button>
                )
              })}
            {!searching && results.length === 0 && (
              <div className="col-span-full py-6 text-center text-xs text-muted-foreground">
                Ничего не найдено. Скины подгружаются синхронизацией на дашборде.
              </div>
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm hover:bg-secondary"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Создать (RTP 95%)
          </button>
        </div>
      </div>
    </div>
  )
}

function SimulationModal({
  name,
  result,
  loading,
  onClose,
}: {
  name: string
  result?: SimResult
  loading: boolean
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">Симуляция 1000 открытий</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{name}</p>

        {loading || !result ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <Row label="Потрачено игроками" value={money(result.spent)} />
            <Row label="Выбили игроки" value={money(result.playersWon)} accent="blue" />
            <Row
              label="Чистая прибыль сайта"
              value={money(result.netProfit)}
              accent={result.netProfit >= 0 ? "green" : "red"}
            />
            <div className="my-3 h-px bg-border" />
            <Row label="Фактический RTP (1000)" value={`${result.actualRtp.toFixed(2)}%`} />
            <Row label="Теоретический RTP" value={`${result.theoreticalRtp.toFixed(2)}%`} />
          </div>
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: "green" | "red" | "blue"
}) {
  const color =
    accent === "green"
      ? "text-primary"
      : accent === "red"
        ? "text-destructive"
        : accent === "blue"
          ? "text-[oklch(0.6_0.2_250)]"
          : "text-foreground"
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  )
}
