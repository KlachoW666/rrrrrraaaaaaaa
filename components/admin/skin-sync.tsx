"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw, CircleCheck, CircleAlert } from "lucide-react"

type SyncState = {
  totalSkins: number
  lastFetched: number
  status: "idle" | "syncing" | "ok" | "error"
  message?: string
}

export function SkinSync({ initialTotal }: { initialTotal: number }) {
  const [state, setState] = useState<SyncState>({
    totalSkins: initialTotal,
    lastFetched: 0,
    status: "idle",
  })
  const pageRef = useRef(0)
  const runningRef = useRef(false)

  useEffect(() => {
    let active = true

    async function sync() {
      if (runningRef.current) return
      runningRef.current = true
      setState((s) => ({ ...s, status: "syncing" }))
      try {
        const res = await fetch(`/api/admin/sync-skins?page=${pageRef.current}`, {
          method: "POST",
        })
        const data = await res.json()
        if (!active) return
        if (data.ok) {
          pageRef.current = data.page ?? 0
          setState({
            totalSkins: data.totalSkins ?? 0,
            lastFetched: data.fetched ?? 0,
            status: "ok",
          })
        } else {
          setState((s) => ({ ...s, status: "error", message: data.error }))
        }
      } catch (e) {
        if (active)
          setState((s) => ({
            ...s,
            status: "error",
            message: e instanceof Error ? e.message : "network error",
          }))
      } finally {
        runningRef.current = false
      }
    }

    sync()
    const id = setInterval(sync, 10_000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-card px-4 py-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          state.status === "error"
            ? "bg-destructive/15 text-destructive"
            : "bg-primary/15 text-primary"
        }`}
      >
        {state.status === "syncing" ? (
          <RefreshCw className="h-4.5 w-4.5 animate-spin" />
        ) : state.status === "error" ? (
          <CircleAlert className="h-4.5 w-4.5" />
        ) : (
          <CircleCheck className="h-4.5 w-4.5" />
        )}
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold">
          Синхронизация скинов Rust · Steam API
        </div>
        <div className="text-xs text-muted-foreground">
          {state.status === "error"
            ? `Ошибка: ${state.message}`
            : `В базе ${state.totalSkins.toLocaleString("ru-RU")} скинов · обновление каждые 10с`}
        </div>
      </div>
    </div>
  )
}
