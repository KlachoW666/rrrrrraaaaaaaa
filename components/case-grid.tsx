import type { CaseItem } from "@/lib/data"
import { CaseCard } from "@/components/case-card"

export function CaseGrid({ items }: { items: CaseItem[] }) {
  if (items.length === 0) {
    return <p className="py-16 text-center text-muted-foreground">Ничего не найдено</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <CaseCard key={item.id} item={item} />
      ))}
    </div>
  )
}
