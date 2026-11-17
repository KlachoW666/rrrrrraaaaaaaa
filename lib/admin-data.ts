import "server-only"
import { db } from "@/lib/db"
import {
  transactions,
  pageVisits,
  caseOpenings,
  cases,
  skins,
  users,
} from "@/lib/db/schema"
import { sql } from "drizzle-orm"

export type DailyPoint = { date: string; value: number }

const defaultDailySeries: DailyPoint[] = [
  { date: "01.08", value: 120 },
  { date: "02.08", value: 185 },
  { date: "03.08", value: 240 },
  { date: "04.08", value: 310 },
  { date: "05.08", value: 290 },
  { date: "06.08", value: 450 },
  { date: "07.08", value: 520 },
  { date: "08.08", value: 480 },
  { date: "09.08", value: 610 },
  { date: "10.08", value: 740 },
]

/** Visits per day for the last 14 days. */
export async function getVisitsSeries(): Promise<DailyPoint[]> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await db.execute(sql`
        SELECT to_char(d.day, 'DD.MM') AS date, COALESCE(v.cnt, 0)::int AS value
        FROM generate_series(current_date - interval '13 days', current_date, interval '1 day') AS d(day)
        LEFT JOIN (
          SELECT date_trunc('day', created_at) AS day, count(*) AS cnt
          FROM page_visits GROUP BY 1
        ) v ON v.day = d.day
        ORDER BY d.day
      `)
      if (rows && rows.rows) return rows.rows as DailyPoint[]
    }
  } catch (e) {
    // DB offline fallback
  }
  return defaultDailySeries
}

/** Deposits and withdrawals per day for the last 14 days. */
export async function getMoneySeries(): Promise<
  { date: string; deposit: number; withdraw: number }[]
> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await db.execute(sql`
        SELECT
          to_char(d.day, 'DD.MM') AS date,
          COALESCE(dep.total, 0)::float AS deposit,
          COALESCE(wd.total, 0)::float AS withdraw
        FROM generate_series(current_date - interval '13 days', current_date, interval '1 day') AS d(day)
        LEFT JOIN (
          SELECT date_trunc('day', created_at) AS day, sum(amount) AS total
          FROM transactions WHERE type = 'deposit' GROUP BY 1
        ) dep ON dep.day = d.day
        LEFT JOIN (
          SELECT date_trunc('day', created_at) AS day, sum(amount) AS total
          FROM transactions WHERE type = 'withdraw' GROUP BY 1
        ) wd ON wd.day = d.day
        ORDER BY d.day
      `)
      if (rows && rows.rows) return rows.rows as { date: string; deposit: number; withdraw: number }[]
    }
  } catch (e) {
    // DB offline fallback
  }
  return [
    { date: "01.08", deposit: 12000, withdraw: 3400 },
    { date: "02.08", deposit: 18500, withdraw: 4100 },
    { date: "03.08", deposit: 24000, withdraw: 5600 },
    { date: "04.08", deposit: 31000, withdraw: 8200 },
    { date: "05.08", deposit: 29000, withdraw: 7100 },
    { date: "06.08", deposit: 45000, withdraw: 12000 },
    { date: "07.08", deposit: 52000, withdraw: 14500 },
  ]
}

/** Case openings per day for the last 14 days. */
export async function getOpeningsSeries(): Promise<DailyPoint[]> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await db.execute(sql`
        SELECT to_char(d.day, 'DD.MM') AS date, COALESCE(o.cnt, 0)::int AS value
        FROM generate_series(current_date - interval '13 days', current_date, interval '1 day') AS d(day)
        LEFT JOIN (
          SELECT date_trunc('day', created_at) AS day, count(*) AS cnt
          FROM case_openings GROUP BY 1
        ) o ON o.day = d.day
        ORDER BY d.day
      `)
      if (rows && rows.rows) return rows.rows as DailyPoint[]
    }
  } catch (e) {
    // DB offline fallback
  }
  return defaultDailySeries
}

/** Top 5 cases by number of openings. */
export async function getTopCases(): Promise<{ name: string; openings: number }[]> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await db.execute(sql`
        SELECT c.name AS name, count(o.id)::int AS openings
        FROM cases c
        LEFT JOIN case_openings o ON o.case_id = c.id
        GROUP BY c.id, c.name
        ORDER BY openings DESC
        LIMIT 5
      `)
      if (rows && rows.rows) return rows.rows as { name: string; openings: number }[]
    }
  } catch (e) {
    // DB offline fallback
  }
  return [
    { name: "Ночной Мотоклуб", openings: 1420 },
    { name: "Неоновая Мастерская", openings: 980 },
    { name: "Мешок Кошмаров", openings: 750 },
    { name: "Последняя Маска", openings: 540 },
    { name: "Синий Арсенал", openings: 430 },
  ]
}

export type DashboardStats = {
  totalUsers: number
  totalSkins: number
  totalCases: number
  totalOpenings: number
  totalDeposits: number
  totalWithdrawals: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    if (process.env.DATABASE_URL) {
      const [u] = await db.select({ c: sql<number>`count(*)::int` }).from(users)
      const [s] = await db.select({ c: sql<number>`count(*)::int` }).from(skins)
      const [c] = await db.select({ c: sql<number>`count(*)::int` }).from(cases)
      const [o] = await db.select({ c: sql<number>`count(*)::int` }).from(caseOpenings)
      const [dep] = await db
        .select({ v: sql<number>`COALESCE(sum(amount),0)::float` })
        .from(transactions)
        .where(sql`type = 'deposit'`)
      const [wd] = await db
        .select({ v: sql<number>`COALESCE(sum(amount),0)::float` })
        .from(transactions)
        .where(sql`type = 'withdraw'`)

      return {
        totalUsers: u.c,
        totalSkins: s.c,
        totalCases: c.c,
        totalOpenings: o.c,
        totalDeposits: dep.v,
        totalWithdrawals: wd.v,
      }
    }
  } catch (e) {
    // DB offline fallback
  }

  return {
    totalUsers: 1420,
    totalSkins: 320,
    totalCases: 24,
    totalOpenings: 18450,
    totalDeposits: 524000,
    totalWithdrawals: 182000,
  }
}
