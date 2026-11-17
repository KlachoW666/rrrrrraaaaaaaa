"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Ticket } from "lucide-react"

export type HeroBanner = {
  id: number
  imageUrl: string
  title: string | null
  subtitle: string | null
  link: string | null
}

const DEFAULT_BANNER: HeroBanner = {
  id: 0,
  imageUrl: "/hero-hazmat.png",
  title: "Сделай ставку и испытай удачу",
  subtitle: "Крути барабан и забирай призовые!",
  link: null,
}

export function PromoHero({ banners = [] }: { banners?: HeroBanner[] }) {
  const [promo, setPromo] = useState("")
  const slides = banners.length > 0 ? banners : [DEFAULT_BANNER]
  const [slide, setSlide] = useState(0)

  // Auto-rotate every 3 seconds through the banners.
  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3000)
    return () => clearInterval(id)
  }, [slides.length])

  const current = slides[Math.min(slide, slides.length - 1)]

  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      {/* Promo card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-[#2a3d0e] via-card to-card p-6">
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <h2 className="relative text-2xl font-extrabold leading-tight text-balance">
          У тебя есть промокод?
        </h2>
        <div className="relative mt-5 flex items-center gap-2 rounded-xl bg-background/60 px-4 py-3">
          <Ticket className="h-4 w-4 text-muted-foreground" />
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Введите промокод"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button className="relative mt-3 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
          Применить
        </button>
      </div>

      {/* Hero banner carousel */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card">
        {slides.map((b, i) => (
          <Image
            key={b.id}
            src={b.imageUrl || "/placeholder.svg"}
            alt={b.title ?? "Баннер"}
            fill
            priority={i === 0}
            className={`object-cover object-right transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        {/* Hazard warning stripe */}
        <div
          className="absolute left-0 right-0 top-0 z-10 h-2.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--primary) 0 14px, #0a0a0a 14px 28px)",
          }}
        />
        <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-center p-7">
          <h1 className="max-w-xs text-3xl font-extrabold leading-tight text-balance md:text-4xl">
            {current.title}
          </h1>
          {current.subtitle && (
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">{current.subtitle}</p>
          )}
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-5 right-6 z-10 flex items-center gap-1.5">
            {slides.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setSlide(i)}
                aria-label={`Слайд ${i + 1}`}
                className={
                  "h-1.5 rounded-full transition-all " +
                  (slide === i ? "w-5 bg-primary" : "w-1.5 bg-white/30")
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
