import { NextResponse, type NextRequest } from "next/server"
import { getCurrentUser, canAccessAdmin } from "@/lib/auth"
import { syncSkinsPage } from "@/lib/steam-skins"
import { getLocalSkins } from "@/lib/local-store"
import { db } from "@/lib/db"
import { skins } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !canAccessAdmin(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const page = Number(req.nextUrl.searchParams.get("page") ?? "0") || 0

  try {
    const result = await syncSkinsPage(page)
    let totalSkins = getLocalSkins().length

    try {
      if (process.env.DATABASE_URL) {
        const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(skins)
        if (count) totalSkins = count
      }
    } catch (e) {
      // DB offline fallback
    }

    return NextResponse.json({ ok: true, ...result, totalSkins })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "sync failed" },
      { status: 502 },
    )
  }
}
