"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, Wallet, Ban, ShieldCheck } from "lucide-react"
import { Coin } from "@/components/coin"
import { formatCoins } from "@/lib/data"
import { adjustBalance, setUserRole, setBanned } from "@/app/admin/users/actions"

type Row = {
  id: number
  steamId: string
  username: string | null
  avatar: string | null
  role: string
  balance: number
  totalDeposit: number
  totalWithdraw: number
  totalLoss: number
  banned: boolean
}

const roleLabels: Record<string, string> = {
  owner: "Владелец",
  admin: "Администратор",
  youtuber: "Ютубер",
  user: "Пользователь",
}

const roleStyles: Record<string, string> = {
  owner: "bg-primary text-primary-foreground",
  admin: "bg-chart-2/20 text-chart-2",
  youtuber: "bg-chart-3/20 text-chart-3",
  user: "bg-secondary text-muted-foreground",
}

export function UserTable({ users, canAssignRoles }: { users: Row[]; canAssignRoles: boolean }) {
  const [query, setQuery] = useState("")
  const [balanceFor, setBalanceFor] = useState<Row | null>(null)
  const [pending, setPending] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) => (u.username ?? "").toLowerCase().includes(q) || u.steamId.includes(q),
    )
  }, [query, users])

  async function handleRole(u: Row, role: string) {
    if (role === u.role) return
    setPending(u.id)
    try {
      await setUserRole(u.id, role)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка")
    } finally {
      setPending(null)
    }
  }

  async function handleBan(u: Row) {
    setPending(u.id)
    try {
      await setBanned(u.id, !u.banned)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка")
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2.5 ring-1 ring-white/5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по нику или SteamID"
          className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-white/5">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Пользователь</th>
              <th className="px-4 py-3 font-semibold">Баланс</th>
              <th className="px-4 py-3 font-semibold">Депозит</th>
              <th className="px-4 py-3 font-semibold">Вывод</th>
              <th className="px-4 py-3 font-semibold">Проигрыш</th>
              <th className="px-4 py-3 font-semibold">Роль</th>
              <th className="px-4 py-3 text-right font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-secondary">
                      {u.avatar ? (
                        <Image src={u.avatar || "/placeholder.svg"} alt="" fill className="object-cover" />
                      ) : null}
                    </div>
                    <div className="leading-tight">
                      <div className="font-semibold">
                        {u.username ?? "—"}
                        {u.banned && <span className="ml-2 text-xs text-destructive">бан</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{u.steamId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    {formatCoins(u.balance)} <Coin className="h-3.5 w-3.5" />
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatCoins(u.totalDeposit)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatCoins(u.totalWithdraw)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatCoins(u.totalLoss)}</td>
                <td className="px-4 py-3">
                  {canAssignRoles && u.role !== "owner" ? (
                    <select
                      value={u.role}
                      disabled={pending === u.id}
                      onChange={(e) => handleRole(u, e.target.value)}
                      className="rounded-lg bg-secondary px-2 py-1 text-xs font-semibold focus:outline-none"
                    >
                      <option value="admin">Администратор</option>
                      <option value="youtuber">Ютубер</option>
                      <option value="user">Пользователь</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block rounded-lg px-2 py-1 text-xs font-semibold ${roleStyles[u.role] ?? roleStyles.user}`}
                    >
                      {roleLabels[u.role] ?? u.role}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setBalanceFor(u)}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      <Wallet className="h-3.5 w-3.5" /> Баланс
                    </button>
                    {u.role !== "owner" && (
                      <button
                        onClick={() => handleBan(u)}
                        disabled={pending === u.id}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                          u.banned ? "bg-secondary text-foreground" : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {u.banned ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                        {u.banned ? "Разбан" : "Бан"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {balanceFor && <BalanceModal user={balanceFor} onClose={() => setBalanceFor(null)} />}
    </div>
  )
}

function BalanceModal({ user, onClose }: { user: Row; onClose: () => void }) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  async function submit(sign: 1 | -1) {
    const value = Number.parseFloat(amount)
    if (!Number.isFinite(value) || value <= 0) {
      alert("Введите сумму больше 0")
      return
    }
    setSaving(true)
    try {
      await adjustBalance(user.id, sign * value, note || undefined)
      onClose()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold">Изменить баланс</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.username ?? user.steamId} — сейчас {formatCoins(user.balance)}
        </p>

        <label className="mt-4 block text-xs font-semibold text-muted-foreground">Сумма</label>
        <div className="mt-1 flex items-center gap-2 rounded-xl bg-input px-3 py-2.5">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
          <Coin className="h-4 w-4" />
        </div>

        <label className="mt-3 block text-xs font-semibold text-muted-foreground">Комментарий</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Причина начисления"
          className="mt-1 w-full rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none"
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            disabled={saving}
            onClick={() => submit(1)}
            className="rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            Начислить
          </button>
          <button
            disabled={saving}
            onClick={() => submit(-1)}
            className="rounded-xl bg-destructive/20 py-2.5 text-sm font-bold text-destructive disabled:opacity-50"
          >
            Списать
          </button>
        </div>
      </div>
    </div>
  )
}
