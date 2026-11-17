"use server"

import { db } from "@/lib/db"
import { settings, banners, promocodes, paymentSystems } from "@/lib/db/schema"
import { getCurrentUser, isFullAdmin } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

async function requireOwner() {
  const me = await getCurrentUser()
  if (!me || !isFullAdmin(me.role)) throw new Error("Только владелец может менять настройки")
}

// ---- Global RTP ----
export async function setGlobalRtp(rtp: number) {
  await requireOwner()
  if (!Number.isFinite(rtp) || rtp < 50 || rtp > 100) throw new Error("RTP должен быть 50–100%")
  await db
    .insert(settings)
    .values({ key: "global_rtp", value: rtp })
    .onConflictDoUpdate({ target: settings.key, set: { value: rtp } })
  revalidatePath("/admin/settings")
}

// ---- Banners (home carousel) ----
export async function addBanner(input: { imageUrl: string; title?: string; subtitle?: string; link?: string }) {
  await requireOwner()
  if (!input.imageUrl.trim()) throw new Error("Нужна картинка баннера")
  await db.insert(banners).values({
    imageUrl: input.imageUrl.trim(),
    title: input.title?.trim() || null,
    subtitle: input.subtitle?.trim() || null,
    link: input.link?.trim() || null,
  })
  revalidatePath("/admin/settings")
  revalidatePath("/")
}

export async function deleteBanner(id: number) {
  await requireOwner()
  await db.delete(banners).where(eq(banners.id, id))
  revalidatePath("/admin/settings")
  revalidatePath("/")
}

export async function toggleBanner(id: number, active: boolean) {
  await requireOwner()
  await db.update(banners).set({ active }).where(eq(banners.id, id))
  revalidatePath("/admin/settings")
  revalidatePath("/")
}

// ---- Promo codes ----
export async function createPromo(input: { code: string; amount: number; maxUses: number }) {
  await requireOwner()
  const code = input.code.trim().toUpperCase()
  if (!code) throw new Error("Введите код")
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("Сумма должна быть > 0")
  await db.insert(promocodes).values({
    code,
    type: "balance",
    amount: String(input.amount),
    maxUses: input.maxUses > 0 ? input.maxUses : 0,
  })
  revalidatePath("/admin/settings")
}

export async function togglePromo(id: number, active: boolean) {
  await requireOwner()
  await db.update(promocodes).set({ active }).where(eq(promocodes.id, id))
  revalidatePath("/admin/settings")
}

export async function deletePromo(id: number) {
  await requireOwner()
  await db.delete(promocodes).where(eq(promocodes.id, id))
  revalidatePath("/admin/settings")
}

// ---- Payment systems ----
export async function upsertPaymentSystem(input: {
  id?: number
  name: string
  type: string
  secretKey?: string
  active: boolean
}) {
  await requireOwner()
  if (!input.name.trim()) throw new Error("Введите название")
  if (input.id) {
    await db
      .update(paymentSystems)
      .set({
        name: input.name.trim(),
        type: input.type.trim(),
        secretKey: input.secretKey?.trim() || null,
        active: input.active,
      })
      .where(eq(paymentSystems.id, input.id))
  } else {
    await db.insert(paymentSystems).values({
      name: input.name.trim(),
      type: input.type.trim(),
      secretKey: input.secretKey?.trim() || null,
      active: input.active,
    })
  }
  revalidatePath("/admin/settings")
}

export async function deletePaymentSystem(id: number) {
  await requireOwner()
  await db.delete(paymentSystems).where(eq(paymentSystems.id, id))
  revalidatePath("/admin/settings")
}
