import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { getCurrentUser, isFullAdmin } from "@/lib/auth"
import { UserTable } from "@/components/admin/user-table"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const me = await getCurrentUser()
  let data: any[] = [
    {
      id: 1,
      steamId: "76561198984276791",
      username: "STALKER_PRO (Super Admin Owner)",
      avatar: "/boss-hazmat.png",
      role: "owner",
      balance: 999999,
      totalDeposit: 50000,
      totalWithdraw: 10000,
      totalLoss: 5000,
      banned: false,
    },
    {
      id: 2,
      steamId: "76561198984270002",
      username: "ToxicSurv",
      avatar: "/boss-hazmat.png",
      role: "user",
      balance: 1450,
      totalDeposit: 2500,
      totalWithdraw: 500,
      totalLoss: 1200,
      banned: false,
    },
  ]

  try {
    if (process.env.DATABASE_URL) {
      const rows = await db.select().from(users).orderBy(desc(users.createdAt)).limit(500)
      if (rows && rows.length > 0) {
        data = rows.map((u) => ({
          id: u.id,
          steamId: u.steamId,
          username: u.username,
          avatar: u.avatar,
          role: u.role,
          balance: Number(u.balance),
          totalDeposit: Number(u.totalDeposit),
          totalWithdraw: Number(u.totalWithdraw),
          totalLoss: Number(u.totalLoss),
          banned: u.banned,
        }))
      }
    }
  } catch (e) {
    // DB offline fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Пользователи</h1>
        <p className="text-sm text-muted-foreground">
          Всего: {data.length}. Баланс, депозиты, проигрыш и управление ролями.
        </p>
      </div>
      <UserTable users={data} canAssignRoles={!!me && isFullAdmin(me.role)} />
    </div>
  )
}
