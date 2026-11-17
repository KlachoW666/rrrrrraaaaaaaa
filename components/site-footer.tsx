import Link from "next/link"
import { Send } from "lucide-react"

const legalLinks = [
  "Пользовательское соглашение",
  "Соглашение о приватности",
  "Политика cookie",
  "Отказ от ответственности",
]

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:pb-10">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        {legalLinks.map((l) => (
          <Link key={l} href="#" className="transition-colors hover:text-foreground">
            {l}
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-3 pb-6">
        <a
          href="#"
          aria-label="Telegram"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
        >
          <Send className="h-4 w-4" />
        </a>
        <a
          href="#"
          aria-label="VK"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          VK
        </a>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 text-[11px] leading-relaxed text-muted-foreground/70 md:flex-row">
        <p className="max-w-xl text-balance text-center md:text-left">
          {"\u00A9 All rights reserved 2026. I.E. Artem Shits, State Registration Number 286.1573426, "}
          {"Armenia, City Yerevan, Arabkir District, N. Zaryan Street, Building 22A"}
        </p>
        <div className="flex items-center gap-2">
          <span className="flex h-6 items-center rounded-full border border-destructive/60 px-2 font-bold text-destructive">
            18+
          </span>
          <span>Вы подтверждаете, что вам 18 лет.</span>
        </div>
      </div>
    </footer>
  )
}
