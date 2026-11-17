import { db } from "@/lib/db"
import { categories, cases } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { CategoryManager } from "@/components/admin/category-manager"
import { getLocalCategories } from "@/lib/local-store"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  let rows: any[] = getLocalCategories()

  try {
    if (process.env.DATABASE_URL) {
      const dbCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          imageUrl: categories.imageUrl,
          caseCount: sql<number>`(SELECT count(*)::int FROM ${cases} WHERE ${cases.categoryId} = ${categories.id})`,
        })
        .from(categories)
        .orderBy(categories.position, categories.id)

      if (dbCategories && dbCategories.length > 0) rows = dbCategories
    }
  } catch (e) {
    // DB offline fallback uses local store
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Категории</h1>
        <p className="text-sm text-muted-foreground">
          Группируйте кейсы по категориям — с названием и картинкой (PNG или URL)
        </p>
      </div>
      <CategoryManager categories={rows} />
    </div>
  )
}
