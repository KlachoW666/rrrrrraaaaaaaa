"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

function MaskGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden="true">
      <path d="M32 6c-9 0-16 6-16 15v6c0 6 3 11 8 14l-2 10c-1 4 2 7 6 7h8c4 0 7-3 6-7l-2-10c5-3 8-8 8-14v-6c0-9-7-15-16-15Zm-7 18a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm14 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm-7 12c-4 0-7-2-8-5h16c-1 3-4 5-8 5Z" />
    </svg>
  )
}

export default function CratePvpPage() {
  const [tab, setTab] = useState<"active" | "finished">("active")

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 md:px-6">
      <button className="mb-6 w-full rounded-2xl bg-[#1f9bde] py-4 text-sm font-bold text-white transition-transform hover:scale-[1.01]">
        Создать замес
      </button>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold md:text-3xl">Замес выживших</h1>
        <div className="flex rounded-xl bg-card p-1">
          <button
            onClick={() => setTab("active")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors md:text-sm ${
              tab === "active" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Активные
          </button>
          <button
            onClick={() => setTab("finished")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors md:text-sm ${
              tab === "finished" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Завершённые
          </button>
        </div>
      </div>

      <div className="flex min-h-[240px] flex-col items-center justify-center py-16 text-center">
        <MaskGlyph className="h-16 w-16 text-muted-foreground/40" />
        <p className="mt-4 text-sm text-muted-foreground">
          {tab === "active" ? "Нет активных замесов" : "Нет завершённых замесов"}
        </p>
      </div>

      <div className="rounded-2xl bg-card p-6 md:p-8">
        <h2 className="mb-6 text-lg font-bold">Как участвовать в замесах?</h2>
        <ol className="space-y-5">
          {[
            "Создайте или присоединитесь к замесу.",
            "Замес начнётся, когда все присоединятся.",
            "Победитель замеса забирает все.",
          ].map((step, i) => (
            <li key={i} className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-muted-foreground/50">{i + 1}</span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
