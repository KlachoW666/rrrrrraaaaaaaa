import Image from "next/image"

export function SectionTitle({
  title,
  subtitle,
  mascot,
}: {
  title: string
  subtitle?: string
  mascot?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-2 text-center">
      {mascot && (
        <Image
          src="/hazmat-logo.png"
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
      )}
      <h2 className="text-2xl font-black uppercase tracking-wide text-balance sm:text-3xl">
        <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      <span className="mt-1 h-1 w-16 rounded-full bg-primary" />
    </div>
  )
}
