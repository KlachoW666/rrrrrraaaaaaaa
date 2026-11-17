"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send, CheckCircle2, PlayCircle, LifeBuoy } from "lucide-react"
import { replyToTicket, takeTicket, closeTicket } from "@/app/actions/support"

type Msg = { id: number; role: string; message: string; createdAt: string }
type Ticket = {
  id: number
  status: string
  subject: string | null
  assignedAdminId: number | null
  user: { username: string | null; avatar: string | null; steamId: string | null }
  updatedAt: string
  messages: Msg[]
}

const statusLabels: Record<string, string> = {
  open: "Новый",
  in_progress: "В работе",
  closed: "Закрыт",
}
const statusStyles: Record<string, string> = {
  open: "bg-chart-4/20 text-chart-4",
  in_progress: "bg-primary/20 text-primary",
  closed: "bg-secondary text-muted-foreground",
}

export function SupportConsole({ tickets }: { tickets: Ticket[] }) {
  const router = useRouter()
  const [activeId, setActiveId] = useState<number | null>(tickets[0]?.id ?? null)
  const [reply, setReply] = useState("")
  const [busy, setBusy] = useState(false)

  const active = tickets.find((t) => t.id === activeId) ?? null

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

  async function handleReply() {
    if (!active || !reply.trim()) return
    const text = reply
    setReply("")
    await run(() => replyToTicket(active.id, text))
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-card py-20 ring-1 ring-white/5">
        <LifeBuoy className="h-12 w-12 text-muted-foreground/40" />
        <p className="mt-3 text-muted-foreground">Активных обращений нет</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      {/* Ticket list */}
      <div className="space-y-2">
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ring-1 transition-colors ${
              t.id === activeId ? "bg-secondary ring-primary/40" : "bg-card ring-white/5 hover:bg-secondary/60"
            }`}
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-secondary">
              {t.user.avatar ? <Image src={t.user.avatar || "/placeholder.svg"} alt="" fill className="object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{t.user.username ?? t.user.steamId ?? "Гость"}</div>
              <div className="truncate text-xs text-muted-foreground">
                {t.messages[t.messages.length - 1]?.message ?? t.subject ?? "—"}
              </div>
            </div>
            <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusStyles[t.status]}`}>
              {statusLabels[t.status]}
            </span>
          </button>
        ))}
      </div>

      {/* Chat */}
      {active ? (
        <div className="flex min-h-[520px] flex-col rounded-2xl bg-card ring-1 ring-white/5">
          <div className="flex items-center justify-between border-b border-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full bg-secondary">
                {active.user.avatar ? <Image src={active.user.avatar || "/placeholder.svg"} alt="" fill className="object-cover" /> : null}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">{active.user.username ?? "Гость"}</div>
                <div className="text-xs text-muted-foreground">{active.user.steamId}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {active.status === "open" && (
                <button
                  onClick={() => run(() => takeTicket(active.id))}
                  disabled={busy}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground disabled:opacity-50"
                >
                  <PlayCircle className="h-4 w-4" /> В работу
                </button>
              )}
              <button
                onClick={() => run(() => closeTicket(active.id))}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Закрыть
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "admin" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === "admin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/5 p-3">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) handleReply()
              }}
              placeholder="Ответить..."
              className="flex-1 rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none"
            />
            <button
              onClick={handleReply}
              disabled={busy || !reply.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground ring-1 ring-white/5">
          Выберите обращение
        </div>
      )}
    </div>
  )
}
