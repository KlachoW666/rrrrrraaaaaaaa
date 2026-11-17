import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import {
  getVisitsSeries,
  getMoneySeries,
  getOpeningsSeries,
  getTopCases,
  getDashboardStats,
} from "@/lib/admin-data"
import {
  VisitsChart,
  MoneyChart,
  OpeningsChart,
  TopCasesChart,
} from "@/components/admin/dashboard-charts"
import { SkinSync } from "@/components/admin/skin-sync"
import { Users, Package, Boxes, DollarSign } from "lucide-react"

export const dynamic = "force-dynamic"

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof Users
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-card p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-extrabold">{value}</div>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  // Support-only admins are redirected to their allowed section.
  const user = await getCurrentUser()
  if (user?.role === "admin") redirect("/admin/support")

  const [visits, money, openings, topCases, stats] = await Promise.all([
    getVisitsSeries(),
    getMoneySeries(),
    getOpeningsSeries(),
    getTopCases(),
    getDashboardStats(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Дашборд</h1>
        <p className="text-sm text-muted-foreground">Обзор ключевых метрик HAZMAT.GG</p>
      </div>

      <SkinSync initialTotal={stats.totalSkins} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Пользователей" value={stats.totalUsers.toLocaleString("ru-RU")} icon={Users} />
        <StatCard label="Скинов в базе" value={stats.totalSkins.toLocaleString("ru-RU")} icon={Boxes} />
        <StatCard label="Кейсов" value={stats.totalCases.toLocaleString("ru-RU")} icon={Package} />
        <StatCard
          label="Открытий кейсов"
          value={stats.totalOpenings.toLocaleString("ru-RU")}
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VisitsChart data={visits} />
        <MoneyChart data={money} />
        <OpeningsChart data={openings} />
        <TopCasesChart data={topCases} />
      </div>
    </div>
  )
}
