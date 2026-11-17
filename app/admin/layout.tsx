import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser, canAccessAdmin } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()

  if (!user) redirect("/?auth=required")
  if (!canAccessAdmin(user.role)) redirect("/?auth=forbidden")

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar role={user.role} username={user.username} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
