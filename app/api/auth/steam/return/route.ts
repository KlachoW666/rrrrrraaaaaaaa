import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { setSessionCookie } from "@/lib/session"
import { OWNER_STEAM_ID } from "@/lib/auth"

const STEAM_ID_RE = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/

async function verifyAssertion(searchParams: URLSearchParams): Promise<boolean> {
  const body = new URLSearchParams()
  searchParams.forEach((v, k) => body.set(k, v))
  body.set("openid.mode", "check_authentication")

  const res = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })
  const text = await res.text()
  return text.includes("is_valid:true")
}

async function fetchProfile(steamId: string) {
  const key = process.env.API_KEY
  if (!key) return null
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamId}`,
      { cache: "no-store" },
    )
    if (!res.ok) return null
    const data = await res.json()
    const p = data?.response?.players?.[0]
    if (!p) return null
    return { username: p.personaname as string, avatar: p.avatarfull as string }
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const origin = req.nextUrl.origin

  const claimedId = sp.get("openid.claimed_id") || ""
  const match = claimedId.match(STEAM_ID_RE)
  if (!match) {
    return NextResponse.redirect(`${origin}/?auth=error`)
  }

  const valid = await verifyAssertion(sp)
  if (!valid) {
    return NextResponse.redirect(`${origin}/?auth=error`)
  }

  const steamId = match[1]
  const profile = await fetchProfile(steamId)

  const [existing] = await db.select().from(users).where(eq(users.steamId, steamId)).limit(1)
  if (existing) {
    await db
      .update(users)
      .set({
        username: profile?.username ?? existing.username,
        avatar: profile?.avatar ?? existing.avatar,
        // Ensure the hardcoded owner always keeps the owner role.
        role: steamId === OWNER_STEAM_ID ? "owner" : existing.role,
      })
      .where(eq(users.steamId, steamId))
  } else {
    await db.insert(users).values({
      steamId,
      username: profile?.username ?? `Player ${steamId.slice(-5)}`,
      avatar: profile?.avatar ?? null,
      role: steamId === OWNER_STEAM_ID ? "owner" : "user",
    })
  }

  await setSessionCookie({ steamId })
  return NextResponse.redirect(`${origin}/`)
}
