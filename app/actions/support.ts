"use server"

import { db } from "@/lib/db"
import { tickets, ticketMessages } from "@/lib/db/schema"
import { getCurrentUser, canAccessSupport } from "@/lib/auth"
import { and, desc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// ---- Player-facing (support widget on the site) ----

// Create a ticket (or reuse the user's active one) and post the first message.
export async function createTicket(message: string) {
  const me = await getCurrentUser()
  if (!me) throw new Error("Войдите, чтобы написать в поддержку")
  const text = message.trim()
  if (!text) throw new Error("Пустое сообщение")

  // Reuse an existing non-closed ticket if present.
  const [existing] = await db
    .select()
    .from(tickets)
    .where(and(eq(tickets.userId, me.id), ne(tickets.status, "closed")))
    .orderBy(desc(tickets.createdAt))
    .limit(1)

  let ticketId = existing?.id
  if (!ticketId) {
    const [created] = await db
      .insert(tickets)
      .values({ userId: me.id, subject: "Обращение с сайта", status: "open" })
      .returning({ id: tickets.id })
    ticketId = created.id
  }

  await db.insert(ticketMessages).values({
    ticketId,
    senderRole: "user",
    senderId: me.id,
    message: text,
  })
  await db.update(tickets).set({ updatedAt: new Date() }).where(eq(tickets.id, ticketId))

  revalidatePath("/admin/support")
  return { ticketId }
}

// Fetch the current user's active ticket with its messages (for the widget).
export async function getMyTicket() {
  const me = await getCurrentUser()
  if (!me) return null

  const [ticket] = await db
    .select()
    .from(tickets)
    .where(and(eq(tickets.userId, me.id), ne(tickets.status, "closed")))
    .orderBy(desc(tickets.createdAt))
    .limit(1)

  if (!ticket) return { ticket: null, messages: [] }

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticket.id))
    .orderBy(ticketMessages.createdAt)

  return {
    ticket: { id: ticket.id, status: ticket.status },
    messages: messages.map((m) => ({
      id: m.id,
      role: m.senderRole,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    })),
  }
}

// ---- Admin-facing ----

async function requireSupport() {
  const me = await getCurrentUser()
  if (!me || !canAccessSupport(me.role)) throw new Error("forbidden")
  return me
}

export async function replyToTicket(ticketId: number, message: string) {
  const me = await requireSupport()
  const text = message.trim()
  if (!text) throw new Error("Пустое сообщение")

  await db.insert(ticketMessages).values({
    ticketId,
    senderRole: "admin",
    senderId: me.id,
    message: text,
  })
  await db.update(tickets).set({ updatedAt: new Date() }).where(eq(tickets.id, ticketId))
  revalidatePath("/admin/support")
}

export async function takeTicket(ticketId: number) {
  const me = await requireSupport()
  await db
    .update(tickets)
    .set({ status: "in_progress", assignedAdminId: me.id, updatedAt: new Date() })
    .where(eq(tickets.id, ticketId))
  revalidatePath("/admin/support")
}

// Close a ticket. Messages are deleted so the chat disappears for the user.
export async function closeTicket(ticketId: number) {
  await requireSupport()
  await db.delete(ticketMessages).where(eq(ticketMessages.ticketId, ticketId))
  await db.update(tickets).set({ status: "closed", updatedAt: new Date() }).where(eq(tickets.id, ticketId))
  revalidatePath("/admin/support")
}
