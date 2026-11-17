import { cn } from "@/lib/utils"

// The site currency is a pig-coin. Rendered as a small circular badge with a snout.
export function Coin({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[62%] w-[62%]">
        <ellipse cx="12" cy="13" rx="8" ry="6.5" fill="currentColor" opacity="0.25" />
        <ellipse cx="12" cy="14" rx="5" ry="3.6" fill="currentColor" />
        <circle cx="10.3" cy="14" r="0.9" fill="var(--color-primary)" />
        <circle cx="13.7" cy="14" r="0.9" fill="var(--color-primary)" />
        <path d="M7 8.5c-1-1.2-2.4-1.6-3.2-1 .2 1.2 1.2 2.2 2.4 2.4" fill="currentColor" />
        <path d="M17 8.5c1-1.2 2.4-1.6 3.2-1-.2 1.2-1.2 2.2-2.4 2.4" fill="currentColor" />
      </svg>
    </span>
  )
}
