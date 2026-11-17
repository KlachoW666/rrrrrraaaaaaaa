import { db } from "@/lib/db"
import { tickets, ticketMessages, users } from "@/lib/db/schema"
import { desc, eq, ne } from "drizzle-orm"
import { SupportConsole } from "@/components/admin/support-console"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
  let data: any[] = [
    {
      id: 1,
      status: "open",
      subject: "Вопрос по выводу скинов",
      assignedAdminId: null,
      user: { username: "STALKER_PRO", avatar: "/boss-hazmat.png", steamId: "76561198984276791" },
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 1,
          role: "user",
          message: "Здравствуйте! Как скоро выводится трейд в Steam?",
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ]

  try {
    if (process.env.DATABASE_URL) {
      const rows = await db
        .select({
          id: tickets.id,
          status: tickets.status,
          subject: tickets.subject,
          createdAt: tickets.createdAt,
          updatedAt: tickets.updatedAt,
          assignedAdminId: tickets.assignedAdminId,
          username: users.username,
          avatar: users.avatar,
          steamId: users.steamId,
        })
        .from(tickets)
        .leftJoin(users, eq(tickets.userId, users.id))
        .where(ne(tickets.status, "closed"))
        .orderBy(desc(tickets.updatedAt))

      const ids = rows.map((r) => r.id)
      const messages = ids.length
        ? await db.select().from(ticketMessages).orderBy(ticketMessages.createdAt)
        : []

      if (rows && rows.length > 0) {
        data = rows.map((r) => ({
          id: r.id,
          status: r.status,
          subject: r.subject,
          assignedAdminId: r.assignedAdminId,
          user: { username: r.username, avatar: r.avatar, steamId: r.steamId },
          updatedAt: r.updatedAt.toISOString(),
          messages: messages
            .filter((m) => m.ticketId === r.id)
            .map((m) => ({
              id: m.id,
              role: m.senderRole,
              message: m.message,
              createdAt: m.createdAt.toISOString(),
            })),
        }))
      }
    }
  } catch (e) {
    // DB offline fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Техническая поддержка</h1>
        <p className="text-sm text-muted-foreground">
          Обращения с сайта. Возьми в работу, ответь и закрой — при закрытии чат удаляется у пользователя.
        </p>
      </div>
      <SupportConsole tickets={data} />
    </div>
  )
}
