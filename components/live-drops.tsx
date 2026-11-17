"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { BarChart3, Radio, ChevronsUp, Radiation } from "lucide-react"
import { liveDrops, rarityColor, formatCoins } from "@/lib/data"
import { Coin } from "@/components/coin"
import { cn } from "@/lib/utils"

export function LiveDrops() {
  const [activeTab, setActiveTab] = useState<"top" | "live">("live")
  const [drops, setDrops] = useState(liveDrops)

  // Live drop stream simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const randomItem = liveDrops[Math.floor(Math.random() * liveDrops.length)]
      const isUpgrader = Math.random() > 0.6
      const newDrop = {
        ...randomItem,
        id: "drop-" + Date.now(),
        sourceType: isUpgrader ? ("upgrader" as const) : ("case" as const),
        multiplier: isUpgrader ? [2, 3, 5][Math.floor(Math.random() * 3)] : undefined,
      }
      setDrops((prev) => [newDrop, ...prev.slice(0, 14)])
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  return (
    <aside
      data-testid="live-drop-panel"
      className="live-drop-panel fixed left-2 top-2 bottom-2 z-40 hidden h-[calc(100vh-16px)] w-[151px] min-w-[151px] flex-col items-center gap-2 overflow-hidden glass-panel p-2 mode-live lg:flex rounded-2xl shadow-2xl"
    >
      {/* TOP / LIVE TAB BAR */}
      <div className="top-bar shrink-0 w-full">
        <div className="flex w-full shrink-0 flex-row items-center gap-1" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab("top")}
            style={activeTab === "top" ? { backgroundImage: "var(--tab-glow-bg)", backgroundSize: "cover" } : undefined}
            className={cn(
              "tab-pill flex h-7 w-auto flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border px-2 py-0 text-xs font-bold transition-colors",
              activeTab === "top"
                ? "border-[#ffc43b]/40 bg-[#ffc43b]/15 text-[#ffc43b]"
                : "border-white/5 bg-white/5 text-white/30 hover:text-white",
            )}
          >
            TOP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("live")}
            style={activeTab === "live" ? { backgroundImage: "var(--tab-glow-bg)", backgroundSize: "cover" } : undefined}
            className={cn(
              "tab-pill flex h-7 w-auto flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border px-2 py-0 text-xs font-bold transition-colors tab-pill--live",
              activeTab === "live"
                ? "border-[#b2ff00]/20 bg-[#b2ff00]/10 text-[#b2ff00]"
                : "border-white/5 bg-white/5 text-white/30 hover:text-white",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              width="14"
              height="14"
              className="shrink-0"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6.667 4.167v11.666" />
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M10 4.167v11.666" />
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M13.333 4.167v11.666" />
            </svg>
            LIVE
          </button>
        </div>
      </div>

      {/* DROPS SCROLL TRACK */}
      <div className="relative w-full flex-1 overflow-hidden min-h-0">
        <div className="flex flex-col space-y-2.5 overflow-y-auto scrollbar-none h-full items-center py-1">
          {drops.map((drop) => {
            const isUpgrader = (drop as any).sourceType === "upgrader"

            return (
              <div
                key={drop.id}
                className={cn(
                  "group item-card price-card relative flex h-[96px] w-[135px] shrink-0 flex-col items-center justify-between rounded-xl border border-white/10 p-2 text-center transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden shadow-lg hover:border-[#b2ff00]/60",
                )}
                style={{
                  boxShadow: `inset 0 -24px 28px -18px ${rarityColor[drop.rarity as keyof typeof rarityColor] || "#b2ff00"}`,
                }}
              >
                {/* Upgrader double-chevron mark SVG (Top-Left) */}
                {isUpgrader && (
                  <div className="upgrader-mark absolute top-1.5 left-2 z-10 text-[#b2ff00]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      className="upgrader-mark-icon"
                    >
                      <g fill="currentColor">
                        <path d="M16.486 11.857 12 9.167l-4.486 2.69A1 1 0 0 1 6 11V7a1 1 0 0 1 .486-.857l5-3a1 1 0 0 1 1.028 0l5 3A1 1 0 0 1 18 7v4a1 1 0 0 1-1.514.857"></path>
                        <path d="M16.486 20.857 12 18.167l-4.486 2.69A1 1 0 0 1 6 20v-4a1 1 0 0 1 .486-.857l5-3a1 1 0 0 1 1.028 0l5 3A1 1 0 0 1 18 16v4a1 1 0 0 1-1.514.857"></path>
                      </g>
                    </svg>
                  </div>
                )}

                {/* Multiplier Badge e.g. x3 / x2 (Top-Right) */}
                {(drop as any).multiplier && (
                  <div className="quantity absolute top-1.5 right-1.5 z-10 flex px-1.5 py-0.5 rounded-md bg-black/50 border border-white/10 text-[10px] font-black text-[#b2ff00]">
                    <span>x{(drop as any).multiplier}</span>
                  </div>
                )}

                {/* Skin Thumbnail */}
                <div className="item-image relative mt-1.5 size-13 flex items-center justify-center z-1">
                  <Image
                    src={drop.image || "/placeholder.svg"}
                    alt={drop.name}
                    width={52}
                    height={52}
                    className="size-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Price Display */}
                <div className="price-container mb-0.5 flex items-center justify-center gap-1 z-1">
                  <span className="font-display text-xs font-black text-white">{formatCoins(drop.price)}</span>
                  <Coin className="h-3.5 w-3.5" />
                </div>

                {/* Hover Layer */}
                <div className="hover-layer absolute inset-0 z-20 flex flex-col justify-end overflow-hidden rounded-xl bg-black/90 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="text-[11px] font-bold text-white truncate">{drop.name}</span>
                  <span className="text-[10px] text-muted-foreground">Игрок</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
