"use client"

import { useState } from "react"
import { CreditCard, Bitcoin, Shirt, Check, Ticket, ChevronRight, History, Link2, Info, ArrowDownToLine } from "lucide-react"
import { Coin } from "@/components/coin"

const quickAmounts = [500, 1000, 3000, 5000, 10000]

function DepositView() {
  const [method, setMethod] = useState("fiat")
  const [amount, setAmount] = useState(100)

  const methods = [
    { id: "fiat", label: "Фиат", icon: CreditCard, hint: "VISA · MC · МИР" },
    { id: "crypto", label: "Крипто", icon: Bitcoin, hint: "USDT · LTC" },
    { id: "skins", label: "Скины", icon: Shirt, hint: "Steam" },
  ]

  return (
    <>
      <div className="rounded-2xl bg-card p-4 md:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold md:text-xl">Выберите способ оплаты</h2>
            <p className="text-xs text-muted-foreground">Зачисление происходит в течение 15 минут</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-input px-3 py-2 text-sm">
            <span>🇷🇺</span> Россия
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {methods.map((m) => {
            const active = method === m.id
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`relative flex flex-col items-center gap-3 rounded-2xl border p-4 transition-colors md:p-6 ${
                  active ? "border-primary bg-primary/10" : "border-white/5 bg-input hover:bg-secondary"
                }`}
              >
                {active && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <m.icon className={`h-7 w-7 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-semibold">{m.label}</span>
                <span className="text-[10px] text-muted-foreground">{m.hint}</span>
              </button>
            )
          })}
        </div>
      </div>

      <button className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-card p-4 text-left">
        <Ticket className="h-5 w-5 text-primary" />
        <span className="flex-1 text-sm">
          <span className="font-bold">Есть промокод?</span>{" "}
          <span className="text-muted-foreground">введи и получи бонус</span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="mt-4 rounded-2xl bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm">
            Пополни ещё <span className="font-bold text-primary">79</span> <Coin className="h-4 w-4" /> — и кейс{" "}
            <span className="font-bold">«Камень»</span> твой бесплатно
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-input">
          <div className="h-full w-[20%] rounded-full bg-primary" />
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-muted-foreground">Введите сумму</label>
          <div className="flex items-center gap-2 rounded-xl bg-input px-4 py-3.5">
            <Coin className="h-5 w-5" />
            <input
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full bg-transparent text-lg font-bold focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted-foreground">Получите на баланс</label>
          <div className="flex items-center gap-2 rounded-xl bg-input px-4 py-3.5">
            <Coin className="h-5 w-5" />
            <span className="text-lg font-bold">{amount}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {quickAmounts.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(a)}
            className="rounded-xl bg-input py-3 text-sm font-semibold hover:bg-secondary"
          >
            {a.toLocaleString("ru-RU")} ₽
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm text-muted-foreground">Телефон</label>
        <input
          placeholder="Введите номер телефона"
          className="w-full rounded-xl bg-input px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4 text-amber-500" />
        Минимальная сумма: 100,00 ₽
      </div>

      <button className="mt-4 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01]">
        Пополнить баланс
      </button>
    </>
  )
}

function WithdrawView() {
  const [sub, setSub] = useState<"skins" | "crypto">("skins")

  return (
    <>
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setSub("skins")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
            sub === "skins" ? "bg-primary/15 text-primary" : "bg-card text-muted-foreground"
          }`}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded bg-destructive text-[9px] text-white">R</span>
          Rust скины
        </button>
        <button
          onClick={() => setSub("crypto")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
            sub === "crypto" ? "bg-primary/15 text-primary" : "bg-card text-muted-foreground"
          }`}
        >
          <Bitcoin className="h-4 w-4" />
          Криптовалюта
        </button>
      </div>

      <div className="rounded-2xl bg-card p-4 md:p-6">
        <div className="flex items-center gap-2 rounded-xl bg-input px-4 py-3.5">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Введите вашу trade-ссылку"
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="shrink-0 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-500">
            Где найти?
          </button>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-input py-3.5 text-sm font-semibold text-muted-foreground">
          <Check className="h-4 w-4" /> Сохранить
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-card p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Ваш выбор</h2>
          <span className="text-right text-xs text-muted-foreground">
            <span className="text-sm font-bold text-foreground">0 / 10</span>
            <br /> предметов
          </span>
        </div>
        <p className="py-10 text-center text-sm text-muted-foreground">
          Выберите предметы слева, чтобы создать обмен
        </p>
        <div className="flex items-center gap-2 rounded-xl bg-input px-4 py-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4" /> Лимит в сутки: 25 000 / 25 000
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Вы получите</span>
          <span className="flex items-center gap-1 font-bold text-primary">
            0 <Coin className="h-4 w-4" />
          </span>
        </div>
        <button className="mt-4 w-full rounded-2xl bg-input py-4 text-sm font-bold text-muted-foreground">
          Вывести
        </button>
      </div>
    </>
  )
}

export default function WalletPage() {
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit")

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setTab("deposit")}
            className={`flex items-center gap-2 text-lg font-bold md:text-2xl ${
              tab === "deposit" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <CreditCard className="h-5 w-5" /> Пополнение
          </button>
          <button
            onClick={() => setTab("withdraw")}
            className={`flex items-center gap-2 text-lg font-bold md:text-2xl ${
              tab === "withdraw" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <ArrowDownToLine className="h-5 w-5" /> Вывод
          </button>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          <History className="h-4 w-4" /> История
        </button>
      </div>

      {tab === "deposit" ? <DepositView /> : <WithdrawView />}
    </div>
  )
}
