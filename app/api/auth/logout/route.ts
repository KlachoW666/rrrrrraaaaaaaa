import { NextResponse, type NextRequest } from "next/server"
import { clearSessionCookie } from "@/lib/session"

export async function GET(req: NextRequest) {
  await clearSessionCookie()
  return NextResponse.redirect(`${req.nextUrl.origin}/`)
}

export async function POST(req: NextRequest) {
  await clearSessionCookie()
  return NextResponse.json({ ok: true })
}
