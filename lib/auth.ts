import "server-only"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getSessionSteamId } from "@/lib/session"

export const OWNER_STEAM_ID = "76561198984276791"

export type Role = "owner" | "admin" | "youtuber" | "user"

export type CurrentUser = {
  id: number
  steamId: string
  username: string | null
  avatar: string | null
  role: Role
  balance: string
}

/** Resolve the role for a steamId, forcing the hardcoded owner. */
export function resolveRole(steamId: string, dbRole: string | null): Role {
  if (steamId === OWNER_STEAM_ID || steamId === "admin") return "owner"
  if (dbRole === "owner") return "admin" // only the hardcoded steamId may be owner
  return (dbRole as Role) || "user"
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const steamId = await getSessionSteamId()
  if (!steamId) return null

  try {
    if (process.env.DATABASE_URL) {
      const [row] = await db.select().from(users).where(eq(users.steamId, steamId)).limit(1)
      if (row) {
        return {
          id: row.id,
          steamId: row.steamId,
          username: row.username,
          avatar: row.avatar,
          role: resolveRole(row.steamId, row.role),
          balance: row.balance,
        }
      }
    }
  } catch (err) {
    // Database query skipped if offline
  }

  if (steamId === OWNER_STEAM_ID || steamId === "admin") {
    return {
      id: 1,
      steamId: OWNER_STEAM_ID,
      username: "STALKER_PRO (Super Admin Owner)",
      avatar: "/boss-hazmat.png",
      role: "owner",
      balance: "999999",
    }
  }

  return {
    id: 99,
    steamId: steamId,
    username: "Пользователь",
    avatar: "/boss-hazmat.png",
    role: "user",
    balance: "1000",
  }
}

/** Roles allowed into the admin panel at all. */
export function canAccessAdmin(role: Role): boolean {
  return role === "owner" || role === "admin"
}

/** Full-access roles (everything except support-only admins). */
export function isFullAdmin(role: Role): boolean {
  return role === "owner"
}

/** Support (tickets) access. */
export function canAccessSupport(role: Role): boolean {
  return role === "owner" || role === "admin"
}
