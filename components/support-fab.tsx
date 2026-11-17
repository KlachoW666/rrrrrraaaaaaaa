"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Headphones, X, Send } from "lucide-react"
import { createTicket, getMyTicket } from "@/app/actions/support"
import { useUI } from "@/components/ui-provider"

type Msg = { id: number; role: string; message: string; createdAt: string }

export function SupportFab() {
  const { user, openAuth } = useUI()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    if (!user) return
    try {
      const res = await getMyTicket()
      if (res) {
        setMessages(res.messages)
        setStatus(res.ticket?.status ?? null)
      }
    } catch {
      // ignore transient errors
    }
  }, [user])

  // Poll for new messages while the widget is open.
  useEffect(() => {
    if (!open || !user) return
    load()
    const id = setInterval(load, 4000)
    return () => clearInterval(id)
  }, [open, user, load])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  async function handleSend() {
    const value = text.trim()
    if (!value) return
    setSending(true)
    setText("")
    // Optimistic append
    setMessages((m) => [...m, { id: Date.now(), role: "user", message: value, createdAt: new Date().toISOString() }])
    try {
      await createTicket(value)
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка")
    } finally {
      setSending(false)
    }
  }

  function toggle() {
    if (!user) {
      openAuth()
      return
    }
    setOpen((o) => !o)
  }

  return (
    <>
      {open && user && (
        <div className="fixed bottom-40 right-4 z-40 flex h-[440px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-white/10 md:bottom-20">
          <div className="flex items-center justify-between border-b border-white/5 bg-secondary/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">Поддержка HAZMAT.GG</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Закрыть">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Опишите проблему — мы ответим здесь же.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))
            )}
            {status === "in_progress" && (
              <p className="text-center text-xs text-primary">Оператор на связи</p>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-white/5 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) handleSend()
              }}
              placeholder="Сообщение..."
              className="flex-1 rounded-xl bg-input px-3 py-2.5 text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={sending || !text.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label="Поддержка"
        className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-card text-foreground shadow-lg ring-1 ring-white/10 transition-colors hover:bg-secondary md:bottom-6"
      >
        <Headphones className="h-5 w-5" />
      </button>
    </>
  )
}
