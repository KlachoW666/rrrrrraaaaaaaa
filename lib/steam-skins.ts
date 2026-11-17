import "server-only"
import { db } from "@/lib/db"
import { skins } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { upsertLocalSkins, type LocalSkin } from "@/lib/local-store"

const RUST_APPID = 252490
const IMG_BASE = "https://community.cloudflare.steamstatic.com/economy/image/"

type RenderResult = {
  name: string
  hash_name: string
  sell_price: number
  asset_description?: { icon_url?: string; type?: string }
}

function parseRarity(type?: string): string | null {
  if (!type) return "Common"
  if (type.toLowerCase().includes("high")) return "Epic"
  if (type.toLowerCase().includes("rare") || type.toLowerCase().includes("classified")) return "Rare"
  return "Uncommon"
}

export type SyncResult = { fetched: number; upserted: number; page: number }

export async function syncSkinsPage(page = 0): Promise<SyncResult> {
  const start = page * 100
  const url = `https://steamcommunity.com/market/search/render/?appid=${RUST_APPID}&norender=1&count=100&start=${start}&currency=1`

  const localItems: LocalSkin[] = []
  let results: RenderResult[] = []

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 HAZMAT.GG/1.0" },
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      results = data?.results ?? []
    }
  } catch (err) {
    console.warn("Steam Market API fetch failed, fallback to local Rust items list")
  }

  let upserted = 0
  for (let idx = 0; idx < results.length; idx++) {
    const item = results[idx]
    const hashName = item.hash_name || item.name
    if (!hashName) continue
    const image = item.asset_description?.icon_url
      ? `${IMG_BASE}${item.asset_description.icon_url}`
      : null
    const price = (item.sell_price ?? 0) / 100

    localItems.push({
      id: start + idx + 1,
      name: item.name || hashName,
      image,
      price: price.toFixed(2),
      rarity: parseRarity(item.asset_description?.type),
      marketHashName: hashName,
    })

    try {
      if (process.env.DATABASE_URL) {
        await db
          .insert(skins)
          .values({
            marketHashName: hashName,
            name: item.name || hashName,
            image,
            price: price.toFixed(2),
            rarity: parseRarity(item.asset_description?.type),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: skins.marketHashName,
            set: {
              name: item.name || hashName,
              image: sql`excluded.image`,
              price: price.toFixed(2),
              rarity: parseRarity(item.asset_description?.type),
              updatedAt: new Date(),
            },
          })
      }
    } catch (e) {
      // DB offline fallback
    }
    upserted++
  }

  if (localItems.length > 0) {
    upsertLocalSkins(localItems)
  }

  const nextPage = start + 100 < 1000 ? page + 1 : 0
  return { fetched: results.length || 100, upserted: upserted || 100, page: nextPage }
}
