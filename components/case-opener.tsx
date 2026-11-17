"use client"

import Image from "next/image"
import { useState } from "react"
import { Zap } from "lucide-react"
import type { CaseItem } from "@/lib/data"
import { formatCoins } from "@/lib/data"
import { Coin } from "@/components/coin"
import { useUI } from "@/components/ui-provider"
import { cn } from "@/lib/utils"

export function CaseOpener({ caseItem }: { caseItem: CaseItem }) {
  const { loggedIn, openAuth } = useUI()
  const [fast, setFast] = useState(true)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card/50 p-6">
      {/* Faded neighbour cases to hint the reel */}
      <div className="flex items-center justify-center gap-6">
        <FadedCase image={caseItem.image} side />
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <div className="absolute h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <Image
            src={caseItem.image || "/placeholder.svg"}
            alt={caseItem.name}
            width={260}
            height={260}
            className="relative h-full w-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)]"
            priority
          />
        </div>
        <FadedCase image={caseItem.image} side />
      </div>

      {/* Open button */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          onClick={loggedIn ? undefined : openAuth}
          className="flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-[0_0_30px_-8px_var(--color-primary)] transition-transform hover:scale-[1.02]"
        >
          {loggedIn ? (
            <>
              Открыть за {formatCoins(caseItem.price)} <Coin className="h-5 w-5" />
            </>
          ) : (
            "Пополнить баланс"
          )}
        </button>

        <button
          onClick={() => setFast((f) => !f)}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
        >
          <Zap className={cn("h-4 w-4", fast && "text-primary")} />
          Быстрый режим
          <span
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              fast ? "bg-primary" : "bg-secondary",
            )}
          >
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
  )
}

function FadedCase({ image, side }: { image: string; side?: boolean }) {
  return (
    <div className={cn("relative hidden h-28 w-28 items-center justify-center opacity-30 md:flex", side && "")}>
      <Image src={image || "/placeholder.svg"} alt="" width={112} height={112} className="h-full w-full object-contain" />
    </div>
  )
}
