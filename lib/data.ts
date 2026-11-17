export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

// Rarity accent used for card borders / glows (mirrors Rust skin rarity colors)
export const rarityColor: Record<Rarity, string> = {
  common: "oklch(0.62 0.01 285)",
  uncommon: "oklch(0.7 0.16 150)",
  rare: "oklch(0.6 0.2 250)",
  epic: "oklch(0.62 0.22 300)",
  legendary: "oklch(0.72 0.2 65)",
}

export type SkinItem = {
  id: string
  name: string
  image: string
  price: number
  rarity: Rarity
}

// Placeholder catalog. Real items + prices will come from the Rust Steam API.
export const skins: SkinItem[] = [
  { id: "s1", name: "Big Grin", image: "/item-helmet.png", price: 94357.17, rarity: "legendary" },
  { id: "s2", name: "Undead Door", image: "/item-box.png", price: 79835.79, rarity: "legendary" },
  { id: "s3", name: "Horror Bag", image: "/item-chest.png", price: 74944.31, rarity: "legendary" },
  { id: "s4", name: "Fire Jacket", image: "/item-chest.png", price: 47835.54, rarity: "epic" },
  { id: "s5", name: "Zipper Face", image: "/item-helmet.png", price: 43402.44, rarity: "epic" },
  { id: "s6", name: "Tempered Mp5", image: "/item-rifle.png", price: 39428.51, rarity: "epic" },
  { id: "s7", name: "No Mercy Revolver", image: "/item-rifle.png", price: 38947.37, rarity: "rare" },
  { id: "s8", name: "Neon Dragon Door", image: "/item-box.png", price: 33902.84, rarity: "rare" },
  { id: "s9", name: "Glory AK47", image: "/item-rifle.png", price: 24117.53, rarity: "epic" },
  { id: "s10", name: "Tempered Mask", image: "/item-helmet.png", price: 16288.97, rarity: "epic" },
  { id: "s11", name: "Halloween Bat", image: "/item-rifle.png", price: 16253.65, rarity: "epic" },
  { id: "s12", name: "Hot Longsword", image: "/item-rifle.png", price: 14733.3, rarity: "epic" },
  { id: "s13", name: "Barb Wire Rock", image: "/item-box.png", price: 232.53, rarity: "legendary" },
  { id: "s14", name: "Medic Helmet", image: "/item-helmet.png", price: 68.73, rarity: "legendary" },
  { id: "s15", name: "Target Practice Tee", image: "/item-chest.png", price: 23.4, rarity: "uncommon" },
  { id: "s16", name: "Black Bandana", image: "/item-chest.png", price: 22.67, rarity: "uncommon" },
  { id: "s17", name: "Grey Longsleeve", image: "/item-chest.png", price: 20.47, rarity: "uncommon" },
  { id: "s18", name: "Green Bandana", image: "/item-chest.png", price: 18.28, rarity: "uncommon" },
  { id: "s19", name: "Rescue Cap", image: "/item-helmet.png", price: 16.09, rarity: "uncommon" },
  { id: "s20", name: "Gun Box", image: "/item-box.png", price: 13.89, rarity: "uncommon" },
  { id: "s21", name: "Blue Bandana", image: "/item-chest.png", price: 13.16, rarity: "rare" },
  { id: "s22", name: "Green Jacket", image: "/item-chest.png", price: 10.97, rarity: "rare" },
  { id: "s23", name: "Urban Camo Pants", image: "/item-chest.png", price: 10.24, rarity: "rare" },
  { id: "s24", name: "Blue Hoodie", image: "/item-chest.png", price: 9.51, rarity: "rare" },
  { id: "s25", name: "Red Tshirt", image: "/item-chest.png", price: 9.51, rarity: "rare" },
  { id: "s26", name: "Rock", image: "/item-box.png", price: 1.2, rarity: "common" },
]

// Live drops shown in the top ticker.
export const liveDrops: SkinItem[] = [
  { id: "d1", name: "Wood Sign", image: "/item-box.png", price: 40, rarity: "common" },
  { id: "d2", name: "Camo Cap", image: "/item-helmet.png", price: 12, rarity: "uncommon" },
  { id: "d3", name: "Medic Cap", image: "/item-helmet.png", price: 16, rarity: "uncommon" },
  { id: "d4", name: "MP5", image: "/item-rifle.png", price: 136, rarity: "rare" },
  { id: "d5", name: "Grenade", image: "/item-box.png", price: 6947, rarity: "legendary" },
  { id: "d6", name: "Boonie", image: "/item-helmet.png", price: 10, rarity: "common" },
  { id: "d7", name: "Blue Cap", image: "/item-helmet.png", price: 10, rarity: "uncommon" },
  { id: "d8", name: "Spark Plug", image: "/item-rifle.png", price: 181, rarity: "rare" },
  { id: "d9", name: "Red Jacket", image: "/item-chest.png", price: 10, rarity: "uncommon" },
]

export type CaseItem = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  left?: number
  total?: number
  tag?: "new" | "hot" | "limited"
}

// Accent glow color per case artwork, used behind the case image on cards.
const caseAccentByImage: Record<string, string> = {
  "/case-newyear.png": "oklch(0.62 0.22 25)", // red
  "/case-blue.png": "oklch(0.6 0.2 250)", // blue
  "/case-purple.png": "oklch(0.62 0.24 300)", // purple/magenta
  "/case-skull.png": "oklch(0.7 0.2 150)", // toxic green
  "/case-gold.png": "oklch(0.75 0.17 70)", // gold
  "/case-green.png": "oklch(0.82 0.24 128)", // lime
}

export function caseAccent(image: string): string {
  return caseAccentByImage[image] ?? "oklch(0.82 0.24 128)"
}

// Limited series — cases with remaining stock progress bars.
export const limitedCases: CaseItem[] = [
  { id: "l1", slug: "neon-workshop", name: "Неоновая Мастерская", image: "/case-newyear.png", price: 150, left: 53362, total: 60000 },
  { id: "l2", slug: "night-club", name: "Ночной Мотоклуб", image: "/case-blue.png", price: 220, left: 46222, total: 50000 },
  { id: "l3", slug: "last-mask", name: "Последняя Маска", image: "/case-purple.png", price: 350, left: 38531, total: 40000 },
  { id: "l4", slug: "nightmare-bag", name: "Мешок Кошмаров", image: "/case-skull.png", price: 720, left: 32812, total: 35000 },
  { id: "l5", slug: "blue-arsenal", name: "Синий Арсенал", image: "/case-blue.png", price: 1200, left: 29430, total: 30000 },
]

// Кабан character series.
export const kabanCases: CaseItem[] = [
  { id: "k1", slug: "superhero", name: "Супергерой", image: "/case-blue.png", price: 229.99 },
  { id: "k2", slug: "farmer", name: "Фермер", image: "/case-gold.png", price: 302 },
  { id: "k3", slug: "cosmonaut", name: "Космонавт", image: "/case-purple.png", price: 805.34 },
  { id: "k4", slug: "raider", name: "Рейдер", image: "/case-green.png", price: 402 },
]

// Standard cases grid.
export const cases: CaseItem[] = [
  { id: "c1", slug: "kamen1", name: "Камень", image: "/case-newyear.png", price: 79, tag: "hot" },
  { id: "c2", slug: "dragon", name: "Дракон", image: "/case-blue.png", price: 199, tag: "hot" },
  { id: "c3", slug: "halloween", name: "Хэллоуин", image: "/case-skull.png", price: 129 },
  { id: "c4", slug: "gold", name: "Золотой", image: "/case-gold.png", price: 499 },
  { id: "c5", slug: "cosmos", name: "Космос", image: "/case-purple.png", price: 249, tag: "new" },
  { id: "c6", slug: "military", name: "Милитари", image: "/case-green.png", price: 89 },
  { id: "c7", slug: "ice", name: "Ледяной", image: "/case-blue.png", price: 179 },
  { id: "c8", slug: "toxic", name: "Токсик", image: "/case-skull.png", price: 99, tag: "new" },
  { id: "c9", slug: "festive", name: "Праздничный", image: "/case-newyear.png", price: 159 },
  { id: "c10", slug: "royale", name: "Рояль", image: "/case-gold.png", price: 599, tag: "hot" },
  { id: "c11", slug: "neon", name: "Неон", image: "/case-purple.png", price: 219 },
  { id: "c12", slug: "assault", name: "Штурм", image: "/case-green.png", price: 119 },
]

export function findCase(slug: string): CaseItem | undefined {
  return [...cases, ...limitedCases, ...kabanCases].find((c) => c.slug === slug)
}

export const siteStats = {
  casesOpened: 1171116,
  upgrades: 252754,
  kabans: 29822,
  online: 158,
}

export type NavKey = "cases" | "upgrade" | "battles" | "top" | "giveaways" | "profile"

export const bottomNav: { key: NavKey; label: string; href: string }[] = [
  { key: "cases", label: "Кейсы", href: "/" },
  { key: "upgrade", label: "Апгрейдер", href: "/upgrader" },
  { key: "battles", label: "Замесы", href: "/crate-pvp" },
  { key: "top", label: "Топ дропов", href: "/top-drops" },
  { key: "giveaways", label: "Розыгрыши", href: "/giveaways" },
  { key: "profile", label: "Профиль", href: "/profile" },
]

export function formatCoins(n: number): string {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 })
}
