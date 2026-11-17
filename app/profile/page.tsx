"use client"

import { useState } from "react"
import { Copy, Settings, Wallet, ArrowDownToLine, Briefcase, ChevronsUp, Swords, Link2, X, Check } from "lucide-react"
import { Coin } from "@/components/coin"

function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [hideFromTops, setHideFromTops] = useState(false)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex w-full max-w-md flex-col overflow-y-auto bg-popover p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Настройки профиля</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-2 text-sm text-muted-foreground">Аватар</p>
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-card p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-3 text-2xl font-bold text-white">
            S
          </div>
          <div className="flex flex-col gap-2">
            <button className="rounded-lg bg-input px-4 py-1.5 text-xs font-semibold">Сменить</button>
            <div className="text-[10px] text-muted-foreground">
              Тип файла: PNG, JPG
              <br /> Рек. размер: 1000x1000 px
              <br /> Макс. размер: 10MB
            </div>
          </div>
        </div>

        <p className="mb-2 text-sm text-muted-foreground">Ваш ник</p>
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-input px-4 py-3">
          <Coin className="h-4 w-4" />
          <input defaultValue="SKINSUP" className="w-full bg-transparent text-sm focus:outline-none" />
        </div>
        <button className="mb-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
          Изменить
        </button>

        <p className="mb-2 text-sm text-muted-foreground">E-mail</p>
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-input px-4 py-3">
          <input
            defaultValue="fade.realmroyale@gmail.com"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
          <Check className="h-4 w-4 text-primary" />
        </div>
        <button className="mb-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
          Изменить
        </button>

        <p className="mb-3 text-sm text-muted-foreground">Приватность</p>
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-card p-4">
          <div className="pr-4">
            <p className="text-sm font-semibold">Скрывать меня из публичных топов</p>
            <p className="text-xs text-muted-foreground">
              Твой личный результат и место останутся видны только тебе.
            </p>
          </div>
          <button
            onClick={() => setHideFromTops((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              hideFromTops ? "bg-primary" : "bg-input"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                hideFromTops ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <p className="mb-3 text-sm text-muted-foreground">Подключение соц. сетей</p>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-xl bg-input py-3 text-sm font-semibold text-muted-foreground">Steam</button>
          <button className="rounded-xl bg-white py-3 text-sm font-semibold text-black">Google</button>
        </div>
      </div>
    </div>
  )
}

function GameHistory() {
  const [tab, setTab] = useState<"cases" | "upgrade" | "pvp">("cases")
  const tabs = [
    { id: "cases", label: "Кейсы" },
    { id: "upgrade", label: "Апгрейд" },
    { id: "pvp", label: "Замесы" },
  ] as const
  return (
    <div className="rounded-2xl bg-card p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold">История игр</h2>
        <div className="flex rounded-xl bg-input p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                tab === t.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-[240px] flex-col items-center justify-center py-16 text-center">
        <Briefcase className="h-12 w-12 text-muted-foreground/30" />
        <p className="mt-4 text-sm text-muted-foreground">Вы еще не играли</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 md:px-6">
      {/* User card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b3a63] to-[#0a2540] p-5 md:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-chart-3 text-2xl font-bold text-white">
            S
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold">SKINSUP</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs">
                <Copy className="h-3 w-3" /> ID 29867
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs"
              >
                <Settings className="h-3 w-3" /> Настройки
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1 text-2xl font-extrabold text-primary">
          0 <Coin className="h-5 w-5" />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground">
            <Wallet className="h-4 w-4" /> Пополнить
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3.5 text-sm font-bold">
            <ArrowDownToLine className="h-4 w-4" /> Вывести
          </button>
        </div>
      </div>

      {/* Favorite case + best drop */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          { label: "Любимый кейс", value: "Нет любимого кейса" },
          { label: "Лучший дроп", value: "Пока ничего нет" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-card p-5">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-lg font-bold">{c.value}</p>
            <button className="mt-3 rounded-lg bg-amber-500/90 px-4 py-2 text-xs font-bold text-black">
              Открыть
            </button>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card p-5">
        <div className="flex flex-wrap gap-8">
          {[
            { icon: Briefcase, label: "Кейсов открыто", value: "0" },
            { icon: ChevronsUp, label: "Апгрейдов", value: "0" },
            { icon: Swords, label: "Замесов", value: "0" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#1f9bde] px-5 py-3 text-sm font-bold text-white">
          <Link2 className="h-4 w-4" /> Трейд-ссылка
        </button>
      </div>

      <div className="mt-4">
        <GameHistory />
      </div>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
