import "server-only"
import { cookies } from "next/headers"
import crypto from "crypto"

const COOKIE_NAME = "hazmat_session"
// Server-only signing secret. Prefer an explicit AUTH_SECRET, otherwise derive
// a stable secret from DATABASE_URL (already a server secret) so sessions work
// out of the box in this environment.
const SECRET =
  process.env.AUTH_SECRET ||
  crypto.createHash("sha256").update(process.env.DATABASE_URL || "hazmat-dev").digest("hex")

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url")
}

export type SessionData = { steamId: string }

export function createSessionToken(data: SessionData): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string | undefined): SessionData | null {
  if (!token) return null
  const [payload, sig] = token.split(".")
  if (!payload || !sig) return null
  if (sign(payload) !== sig) return null
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as SessionData
  } catch {
    return null
  }
}

export async function setSessionCookie(data: SessionData) {
  const store = await cookies()
  store.set(COOKIE_NAME, createSessionToken(data), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getSessionSteamId(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return verifySessionToken(token)?.steamId ?? null
}
