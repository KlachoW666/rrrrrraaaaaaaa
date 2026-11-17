import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Info } from "lucide-react"
import { findCase, skins } from "@/lib/data"
import { CaseOpener } from "@/components/case-opener"
import { ItemCard } from "@/components/item-card"

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caseItem = findCase(slug)
  if (!caseItem) notFound()

  // Contents sorted by price desc, as on the reference site.
  const contents = [...skins].sort((a, b) => b.price - a.price)

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      {/* Header row */}
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/"
          aria-label="Назад"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold">{caseItem.name}</h1>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground sm:flex">
            <Info className="h-3.5 w-3.5" /> Средний риск
          </span>
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <span className="h-1 w-16 overflow-hidden rounded-full bg-background">
              <span className="block h-full w-1/2 bg-primary" />
            </span>
          </div>
        </div>
      </div>

      <CaseOpener caseItem={caseItem} />

      {/* Contents */}
      <div className="mt-10">
        <h2 className="mb-5 text-center text-xl font-extrabold">Содержимое кейса</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {contents.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
