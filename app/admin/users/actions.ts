"use server"

import { db } from "@/lib/db"
import { users, transactions } from "@/lib/db/schema"
import { getCurrentUser, canAccessAdmin, isFullAdmin, OWNER_STEAM_ID } from "@/lib/auth"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const me = await getCurrentUser()
  if (!me || !canAccessAdmin(me.role)) throw new Error("forbidden")
  return me
}

// Adjust a user's balance (positive to credit, negative to debit). Admins+ allowed.
export async function adjustBalance(userId: number, amount: number, note?: string) {
  await requireAdmin()
  if (!Number.isFinite(amount) || amount === 0) throw new Error("Некорректная сумма")

  await db
    .update(users)
    .set({ balance: sql`${users.balance} + ${amount}` })
    .where(eq(users.id, userId))

  await db.insert(transactions).values({
    userId,
    type: amount > 0 ? "admin_credit" : "admin_debit",
    amount: String(amount),
    meta: { note: note ?? null },
  })

  revalidatePath("/admin/users")
}

// Change a user's role. Only the owner may assign roles, and the owner role
// stays reserved for the hard-coded SteamID.
export async function setUserRole(userId: number, role: string) {
  const me = await getCurrentUser()
  if (!me || !isFullAdmin(me.role)) throw new Error("Только владелец может выдавать роли")

  const allowed = ["admin", "youtuber", "user"]
  if (!allowed.includes(role)) throw new Error("Недопустимая роль")

  const [target] = await db.select().from(users).where(eq(users.id, userId))
  if (!target) throw new Error("Пользователь не найден")
  if (target.steamId === OWNER_STEAM_ID) throw new Error("Нельзя изменить роль владельца")

  await db.update(users).set({ role }).where(eq(users.id, userId))
  revalidatePath("/admin/users")
}

// Ban / unban a user.
export async function setBanned(userId: number, banned: boolean) {
  await requireAdmin()
  const [target] = await db.select().from(users).where(eq(users.id, userId))
  if (target?.steamId === OWNER_STEAM_ID) throw new Error("Нельзя забанить владельца")
  await db.update(users).set({ banned }).where(eq(users.id, userId))
  revalidatePath("/admin/users")
}
