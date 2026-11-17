import { db } from "@/lib/db"
import { cases, categories, caseItems } from "@/lib/db/schema"
import { sql, desc } from "drizzle-orm"
import { CaseManager } from "@/components/admin/case-manager"

export const dynamic = "force-dynamic"

export default async function CasesPage() {
  let caseRows: any[] = [
    { id: 1, name: "Неоновая Мастерская", price: "150.00", imageUrl: "/art/case-toxic.png", rtp: "95.00", tag: "HOT", active: true, categoryId: 1, itemCount: 12 },
    { id: 2, name: "Ночной Мотоклуб", price: "220.00", imageUrl: "/art/case-custom.png", rtp: "95.00", tag: "LIMITED", active: true, categoryId: 1, itemCount: 16 },
    { id: 3, name: "Последняя Маска", price: "350.00", imageUrl: "/art/case-[#b2ff00].png", rtp: "95.00", tag: "SPECIAL", active: true, categoryId: 2, itemCount: 10 },
  ]
  let categoryRows: any[] = [
    { id: 1, name: "Лимитированная серия" },
    { id: 2, name: "HAZMAT" },
  ]

  try {
    if (process.env.DATABASE_URL) {
      const [dbCases, dbCategories] = await Promise.all([
        db
          .select({
            id: cases.id,
            name: cases.name,
            price: cases.price,
            imageUrl: cases.imageUrl,
            rtp: cases.rtp,
            tag: cases.tag,
            active: cases.active,
            categoryId: cases.categoryId,
            itemCount: sql<number>`(SELECT count(*)::int FROM ${caseItems} WHERE ${caseItems.caseId} = ${cases.id})`,
          })
          .from(cases)
          .orderBy(desc(cases.createdAt)),
        db.select().from(categories).orderBy(categories.name),
      ])
      if (dbCases && dbCases.length > 0) caseRows = dbCases
      if (dbCategories && dbCategories.length > 0) categoryRows = dbCategories
    }
  } catch (e) {
    // DB offline fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Кейсы</h1>
        <p className="text-sm text-muted-foreground">
          Создавайте кейсы — RTP автоматически балансируется на 95%
        </p>
      </div>
      <CaseManager
        cases={caseRows}
        categories={categoryRows.map((c: any) => ({ id: c.id, name: c.name }))}
      />
    </div>
  )
}
