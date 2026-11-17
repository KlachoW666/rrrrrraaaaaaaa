"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, Plus, ImageIcon, Ticket, CreditCard, Gauge } from "lucide-react"
import {
  setGlobalRtp,
  addBanner,
  deleteBanner,
  toggleBanner,
  createPromo,
  togglePromo,
  deletePromo,
  upsertPaymentSystem,
  deletePaymentSystem,
} from "@/app/admin/settings/actions"

type Banner = { id: number; imageUrl: string; title: string | null; subtitle: string | null; link: string | null; active: boolean }
type Promo = { id: number; code: string; amount: number; maxUses: number; uses: number; active: boolean }
type Payment = { id: number; name: string; type: string | null; hasSecret: boolean; active: boolean }

export function SettingsPanels({
  globalRtp,
  banners,
  promos,
  payments,
}: {
  globalRtp: number
  banners: Banner[]
  promos: Promo[]
  payments: Payment[]
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function run(fn: () => Promise<unknown>) {
    setBusy(true)
    try {
      await fn()
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <RtpPanel globalRtp={globalRtp} busy={busy} run={run} />
      <PromoPanel promos={promos} busy={busy} run={run} />
      <BannerPanel banners={banners} busy={busy} run={run} />
      <PaymentPanel payments={payments} busy={busy} run={run} />
    </div>
  )
}

function Card({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-card p-5 ring-1 ring-white/5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</div>
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

type RunFn = (fn: () => Promise<unknown>) => Promise<void>

function RtpPanel({ globalRtp, busy, run }: { globalRtp: number; busy: boolean; run: RunFn }) {
  const [rtp, setRtp] = useState(String(globalRtp))
  return (
    <Card icon={<Gauge className="h-5 w-5" />} title="Глобальный RTP" desc="Возврат игроку по умолчанию для новых кейсов">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground">RTP, %</label>
          <input
            type="number"
            value={rtp}
            min={50}
            max={100}
            onChange={(e) => setRtp(e.target.value)}
            className="mt-1 w-full rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none"
          />
        </div>
        <button
          disabled={busy}
          onClick={() => run(() => setGlobalRtp(Number.parseFloat(rtp)))}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          Сохранить
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        При создании кейса шансы дропа автоматически балансируются под этот RTP.
      </p>
    </Card>
  )
}

function PromoPanel({ promos, busy, run }: { promos: Promo[]; busy: boolean; run: RunFn }) {
  const [code, setCode] = useState("")
  const [amount, setAmount] = useState("")
  const [maxUses, setMaxUses] = useState("")

  return (
    <Card icon={<Ticket className="h-5 w-5" />} title="Промокоды" desc="Начисление баланса по коду">
      <div className="grid grid-cols-3 gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CODE" className="rounded-xl bg-input px-3 py-2.5 text-sm uppercase focus:outline-none" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Сумма" className="rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none" />
        <input value={maxUses} onChange={(e) => setMaxUses(e.target.value)} type="number" placeholder="Лимит" className="rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none" />
      </div>
      <button
        disabled={busy}
        onClick={() =>
          run(async () => {
            await createPromo({ code, amount: Number.parseFloat(amount), maxUses: Number.parseInt(maxUses || "0") })
            setCode("")
            setAmount("")
            setMaxUses("")
          })
        }
        className="mt-2 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
      >
        <Plus className="h-4 w-4" /> Создать код
      </button>

      <div className="mt-4 space-y-2">
        {promos.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2 text-sm">
            <div>
              <span className="font-bold">{p.code}</span>
              <span className="ml-2 text-muted-foreground">
                {p.amount} • {p.uses}/{p.maxUses === 0 ? "∞" : p.maxUses}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => run(() => togglePromo(p.id, !p.active))} className={`rounded-md px-2 py-1 text-xs font-semibold ${p.active ? "bg-primary/20 text-primary" : "bg-input text-muted-foreground"}`}>
                {p.active ? "вкл" : "выкл"}
              </button>
              <button onClick={() => run(() => deletePromo(p.id))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {promos.length === 0 && <p className="text-xs text-muted-foreground">Пока нет промокодов</p>}
      </div>
    </Card>
  )
}

function BannerPanel({ banners, busy, run }: { banners: Banner[]; busy: boolean; run: RunFn }) {
  const [imageUrl, setImageUrl] = useState("")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  return (
    <Card icon={<ImageIcon className="h-5 w-5" />} title="Баннеры главной" desc="Карусель: 3 баннера по 3 секунды со скроллом">
      <div className="space-y-2">
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL картинки" className="w-full rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none" />
        <div className="grid grid-cols-2 gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" className="rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none" />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Подзаголовок" className="rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none" />
        </div>
        <button
          disabled={busy}
          onClick={() =>
            run(async () => {
              await addBanner({ imageUrl, title, subtitle })
              setImageUrl("")
              setTitle("")
              setSubtitle("")
            })
          }
          className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Добавить баннер
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {banners.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-2">
            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-input">
              <Image src={b.imageUrl || "/placeholder.svg"} alt="" fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{b.title ?? "Без заголовка"}</div>
              <div className="truncate text-xs text-muted-foreground">{b.subtitle ?? b.imageUrl}</div>
            </div>
            <button onClick={() => run(() => toggleBanner(b.id, !b.active))} className={`rounded-md px-2 py-1 text-xs font-semibold ${b.active ? "bg-primary/20 text-primary" : "bg-input text-muted-foreground"}`}>
              {b.active ? "вкл" : "выкл"}
            </button>
            <button onClick={() => run(() => deleteBanner(b.id))} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {banners.length === 0 && <p className="text-xs text-muted-foreground">Баннеров нет — на главной показывается баннер по умолчанию</p>}
      </div>
    </Card>
  )
}

function PaymentPanel({ payments, busy, run }: { payments: Payment[]; busy: boolean; run: RunFn }) {
  const [name, setName] = useState("")
  const [type, setType] = useState("card")
  const [secret, setSecret] = useState("")

  return (
    <Card icon={<CreditCard className="h-5 w-5" />} title="Платёжные системы" desc="Добавляй платёжки и их секретные ключи">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название (напр. Enot)" className="rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none">
            <option value="card">Карты</option>
            <option value="crypto">Крипта</option>
            <option value="wallet">Кошелёк</option>
          </select>
        </div>
        <input value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Секретный ключ" type="password" className="w-full rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none" />
        <button
          disabled={busy}
          onClick={() =>
            run(async () => {
              await upsertPaymentSystem({ name, type, secretKey: secret, active: true })
              setName("")
              setSecret("")
            })
          }
          className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Подключить
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {payments.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2 text-sm">
            <div>
              <span className="font-bold">{p.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {p.type} • {p.hasSecret ? "ключ задан" : "нет ключа"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => run(() => upsertPaymentSystem({ id: p.id, name: p.name, type: p.type ?? "card", active: !p.active }))} className={`rounded-md px-2 py-1 text-xs font-semibold ${p.active ? "bg-primary/20 text-primary" : "bg-input text-muted-foreground"}`}>
                {p.active ? "вкл" : "выкл"}
              </button>
              <button onClick={() => run(() => deletePaymentSystem(p.id))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {payments.length === 0 && <p className="text-xs text-muted-foreground">Платёжных систем нет</p>}
      </div>
    </Card>
  )
}
