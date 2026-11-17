import { NextResponse, type NextRequest } from "next/server"
import { getCurrentUser, isFullAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { skins } from "@/lib/db/schema"
import { desc, ilike } from "drizzle-orm"
import { getLocalSkins } from "@/lib/local-store"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !isFullAdmin(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? ""

  try {
    if (process.env.DATABASE_URL) {
      const rows = await db
        .select({
          id: skins.id,
          name: skins.name,
          image: skins.image,
          price: skins.price,
          rarity: skins.rarity,
        })
        .from(skins)
        .where(q ? ilike(skins.name, `%${q}%`) : undefined)
        .orderBy(desc(skins.price))
        .limit(50)

      if (rows && rows.length > 0) {
        return NextResponse.json({ skins: rows })
      }
    }
  } catch (e) {
    // DB query fallback to local skins store
  }

  const localSkins = getLocalSkins(q)
  return NextResponse.json({ skins: localSkins })
}
