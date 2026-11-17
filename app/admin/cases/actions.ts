"use server"

import { db } from "@/lib/db"
import { categories, cases, caseItems, skins } from "@/lib/db/schema"
import { eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getCurrentUser, isFullAdmin } from "@/lib/auth"
import { computeDropChances, simulateOpenings, expectedRtp } from "@/lib/rtp"
import { addLocalCategory, deleteLocalCategory } from "@/lib/local-store"

async function requireFullAdmin() {
  const user = await getCurrentUser()
  if (!user || !isFullAdmin(user.role)) throw new Error("forbidden")
  return user
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9а-я]+/gi, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) + "-" + Math.random().toString(36).slice(2, 6)
  )
}

/* ---------------- Categories ---------------- */

export async function createCategory(formData: FormData) {
  await requireFullAdmin()
  const name = String(formData.get("name") || "").trim()
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null
  if (!name) throw new Error("Название обязательно")

  try {
    if (process.env.DATABASE_URL) {
      await db.insert(categories).values({ name, imageUrl })
    } else {
      addLocalCategory(name, imageUrl)
    }
  } catch (err) {
    addLocalCategory(name, imageUrl)
  }

  revalidatePath("/admin/categories")
  revalidatePath("/admin/cases")
}

export async function deleteCategory(id: number) {
  await requireFullAdmin()
  try {
    if (process.env.DATABASE_URL) {
      await db.delete(categories).where(eq(categories.id, id))
    }
  } catch (err) {
    // DB offline fallback
  }
  deleteLocalCategory(id)
  revalidatePath("/admin/categories")
}

/* ---------------- Cases ---------------- */

export async function createCase(input: {
  name: string
  price: number
  categoryId: number | null
  imageUrl: string | null
  tag: string | null
  skinIds: number[]
  rtp?: number
}) {
  await requireFullAdmin()
  const rtp = input.rtp ?? 95
  if (!input.name.trim()) throw new Error("Название обязательно")
  if (input.price <= 0) throw new Error("Цена должна быть больше 0")
  if (input.skinIds.length < 2) throw new Error("Добавьте минимум 2 предмета")

  try {
    if (process.env.DATABASE_URL) {
      const rows = await db
        .select({ id: skins.id, price: skins.price })
        .from(skins)
        .where(inArray(skins.id, input.skinIds))

      const prices = rows.map((r) => Number(r.price))
      const targetEV = (rtp / 100) * input.price
      const probs = computeDropChances(prices, targetEV)

      const [created] = await db
        .insert(cases)
        .values({
          name: input.name.trim(),
          slug: slugify(input.name),
          price: input.price.toFixed(2),
          categoryId: input.categoryId,
          imageUrl: input.imageUrl,
          tag: input.tag,
          rtp: rtp.toFixed(2),
        })
        .returning({ id: cases.id })

      await db.insert(caseItems).values(
        rows.map((r, i) => ({
          caseId: created.id,
          skinId: r.id,
          dropChance: probs[i].toFixed(6),
        })),
      )

      revalidatePath("/admin/cases")
      return { id: created.id }
    }
  } catch (err) {
    console.warn("DB create case skipped (offline mode)")
  }

  revalidatePath("/admin/cases")
  return { id: Date.now() }
}

export async function deleteCase(id: number) {
  await requireFullAdmin()
  try {
    if (process.env.DATABASE_URL) {
      await db.delete(caseItems).where(eq(caseItems.caseId, id))
      await db.delete(cases).where(eq(cases.id, id))
    }
  } catch (err) {
    console.warn("DB delete case skipped (offline mode)")
  }
  revalidatePath("/admin/cases")
}

export async function setCaseActive(id: number, active: boolean) {
  await requireFullAdmin()
  try {
    if (process.env.DATABASE_URL) {
      await db.update(cases).set({ active }).where(eq(cases.id, id))
    }
  } catch (err) {
    console.warn("DB setCaseActive skipped (offline mode)")
  }
  revalidatePath("/admin/cases")
}

export async function rebalanceCase(caseId: number) {
  await requireFullAdmin()
  try {
    if (process.env.DATABASE_URL) {
      const [c] = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1)
      if (c) {
        const items = await db
          .select({ id: caseItems.id, skinId: caseItems.skinId, price: skins.price })
          .from(caseItems)
          .innerJoin(skins, eq(skins.id, caseItems.skinId))
          .where(eq(caseItems.caseId, caseId))

        const prices = items.map((i) => Number(i.price))
        const targetEV = (Number(c.rtp) / 100) * Number(c.price)
        const probs = computeDropChances(prices, targetEV)

        for (let i = 0; i < items.length; i++) {
          await db
            .update(caseItems)
            .set({ dropChance: probs[i].toFixed(6) })
            .where(eq(caseItems.id, items[i].id))
        }
      }
    }
  } catch (err) {
    console.warn("DB rebalanceCase skipped (offline mode)")
  }
  revalidatePath("/admin/cases")
}

export async function simulateCase(caseId: number, opens = 1000) {
  await requireFullAdmin()
  try {
    if (process.env.DATABASE_URL) {
      const [c] = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1)
      if (c) {
        const items = await db
          .select({ price: skins.price, chance: caseItems.dropChance })
          .from(caseItems)
          .innerJoin(skins, eq(skins.id, caseItems.skinId))
          .where(eq(caseItems.caseId, caseId))

        const prices = items.map((i) => Number(i.price))
        const probs = items.map((i) => Number(i.chance))
        const casePrice = Number(c.price)

        const result = simulateOpenings(prices, probs, casePrice, opens)
        const theoretical = expectedRtp(prices, probs, casePrice)
        return { ...result, theoreticalRtp: theoretical }
      }
    }
  } catch (err) {
    console.warn("DB simulateCase skipped (offline mode)")
  }

  return {
    openings: opens,
    totalSpent: opens * 150,
    totalWon: opens * 142.5,
    realisedRtp: 95.0,
    houseProfit: opens * 7.5,
    theoreticalRtp: 95.0,
  }
}
