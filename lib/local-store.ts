import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), ".data-store.json")

export type LocalCategory = {
  id: number
  name: string
  imageUrl: string | null
  caseCount?: number
}

export type LocalSkin = {
  id: number | string
  name: string
  image: string | null
  price: string
  rarity: string | null
  marketHashName?: string
}

export type LocalCase = {
  id: number
  name: string
  price: string
  imageUrl: string | null
  rtp: string
  tag: string | null
  active: boolean
  categoryId: number | null
  itemCount?: number
}

const INITIAL_CATEGORIES: LocalCategory[] = [
  { id: 1, name: "Лимитированная серия", imageUrl: "/case-toxic.png", caseCount: 5 },
  { id: 2, name: "HAZMAT", imageUrl: "/boss-hazmat.png", caseCount: 4 },
  { id: 3, name: "Горячие кейсы", imageUrl: "/case-gold.png", caseCount: 6 },
]

const INITIAL_SKINS: LocalSkin[] = [
  { id: 1, name: "Big Grin", image: "/item-helmet.png", price: "94357.17", rarity: "Legendary" },
  { id: 2, name: "Undead Door", image: "/item-box.png", price: "79835.79", rarity: "Legendary" },
  { id: 3, name: "Horror Bag", image: "/item-chest.png", price: "74944.31", rarity: "Legendary" },
  { id: 4, name: "Fire Jacket", image: "/item-chest.png", price: "47835.54", rarity: "Epic" },
  { id: 5, name: "Zipper Face", image: "/item-helmet.png", price: "43402.44", rarity: "Epic" },
  { id: 6, name: "Tempered Mp5", image: "/item-rifle.png", price: "39428.51", rarity: "Epic" },
  { id: 7, name: "No Mercy Revolver", image: "/item-rifle.png", price: "38947.37", rarity: "Rare" },
  { id: 8, name: "Neon Dragon Door", image: "/item-box.png", price: "33902.84", rarity: "Rare" },
  { id: 9, name: "Glory AK47", image: "/item-rifle.png", price: "24117.53", rarity: "Epic" },
  { id: 10, name: "Tempered Mask", image: "/item-helmet.png", price: "16288.97", rarity: "Epic" },
  { id: 11, name: "Halloween Bat", image: "/item-rifle.png", price: "16253.65", rarity: "Epic" },
  { id: 12, name: "Hot Longsword", image: "/item-rifle.png", price: "14733.30", rarity: "Epic" },
  { id: 13, name: "Barb Wire Rock", image: "/item-box.png", price: "232.53", rarity: "Legendary" },
  { id: 14, name: "Medic Helmet", image: "/item-helmet.png", price: "68.73", rarity: "Legendary" },
  { id: 15, name: "Target Practice Tee", image: "/item-chest.png", price: "23.40", rarity: "Uncommon" },
  { id: 16, name: "Black Bandana", image: "/item-chest.png", price: "22.67", rarity: "Uncommon" },
  { id: 17, name: "Grey Longsleeve", image: "/item-chest.png", price: "20.47", rarity: "Uncommon" },
  { id: 18, name: "Green Bandana", image: "/item-chest.png", price: "18.28", rarity: "Uncommon" },
  { id: 19, name: "Rescue Cap", image: "/item-helmet.png", price: "16.09", rarity: "Uncommon" },
  { id: 20, name: "Gun Box", image: "/item-box.png", price: "13.89", rarity: "Uncommon" },
]

type StoreData = {
  categories: LocalCategory[]
  cases: LocalCase[]
  skins: LocalSkin[]
}

function loadStore(): StoreData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8")
      const parsed = JSON.parse(raw)
      return {
        categories: parsed.categories || INITIAL_CATEGORIES,
        cases: parsed.cases || [],
        skins: parsed.skins || INITIAL_SKINS,
      }
    }
  } catch (e) {
    // Ignore read errors
  }

  return {
    categories: INITIAL_CATEGORIES,
    cases: [],
    skins: INITIAL_SKINS,
  }
}

function saveStore(data: StoreData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (e) {
    console.error("Failed to save store:", e)
  }
}

export function getLocalCategories(): LocalCategory[] {
  const store = loadStore()
  return store.categories
}

export function addLocalCategory(name: string, imageUrl: string | null): LocalCategory {
  const store = loadStore()
  const newCat: LocalCategory = {
    id: Date.now(),
    name,
    imageUrl,
    caseCount: 0,
  }
  store.categories.unshift(newCat)
  saveStore(store)
  return newCat
}

export function deleteLocalCategory(id: number) {
  const store = loadStore()
  store.categories = store.categories.filter((c) => c.id !== id)
  saveStore(store)
}

export function getLocalSkins(query?: string): LocalSkin[] {
  const store = loadStore()
  let skinsList = store.skins
  if (query) {
    const q = query.toLowerCase()
    skinsList = skinsList.filter((s) => s.name.toLowerCase().includes(q))
  }
  return skinsList
}

export function upsertLocalSkins(newSkins: LocalSkin[]): number {
  const store = loadStore()
  const map = new Map<string, LocalSkin>()
  for (const s of store.skins) {
    map.set(s.name, s)
  }
  for (const s of newSkins) {
    map.set(s.name, s)
  }
  store.skins = Array.from(map.values())
  saveStore(store)
  return store.skins.length
}
