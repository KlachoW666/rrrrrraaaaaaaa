import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  steamId: text("steam_id").notNull().unique(),
  username: text("username"),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  balance: numeric("balance", { precision: 14, scale: 2 }).notNull().default("0"),
  totalDeposit: numeric("total_deposit", { precision: 14, scale: 2 }).notNull().default("0"),
  totalWithdraw: numeric("total_withdraw", { precision: 14, scale: 2 }).notNull().default("0"),
  totalLoss: numeric("total_loss", { precision: 14, scale: 2 }).notNull().default("0"),
  tradeUrl: text("trade_url"),
  banned: boolean("banned").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const skins = pgTable("skins", {
  id: serial("id").primaryKey(),
  marketHashName: text("market_hash_name").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  price: numeric("price", { precision: 14, scale: 2 }).notNull().default("0"),
  rarity: text("rarity"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  price: numeric("price", { precision: 14, scale: 2 }).notNull().default("0"),
  imageUrl: text("image_url"),
  categoryId: integer("category_id"),
  rtp: numeric("rtp", { precision: 5, scale: 2 }).notNull().default("95"),
  tag: text("tag"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const caseItems = pgTable("case_items", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  skinId: integer("skin_id").notNull(),
  dropChance: numeric("drop_chance", { precision: 9, scale: 6 }).notNull().default("0"),
})

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject"),
  status: text("status").notNull().default("open"),
  assignedAdminId: integer("assigned_admin_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  senderRole: text("sender_role").notNull(),
  senderId: integer("sender_id"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const promocodes = pgTable("promocodes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull().default("balance"),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull().default("0"),
  maxUses: integer("max_uses").notNull().default(0),
  uses: integer("uses").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
})

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  subtitle: text("subtitle"),
  link: text("link"),
  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const paymentSystems = pgTable("payment_systems", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type"),
  config: jsonb("config"),
  secretKey: text("secret_key"),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: text("type").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull().default("0"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const caseOpenings = pgTable("case_openings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  caseId: integer("case_id").notNull(),
  skinId: integer("skin_id"),
  cost: numeric("cost", { precision: 14, scale: 2 }).notNull().default("0"),
  wonValue: numeric("won_value", { precision: 14, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pageVisits = pgTable("page_visits", {
  id: serial("id").primaryKey(),
  path: text("path"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
