import { NextResponse } from "next/server"
import { setSessionCookie } from "@/lib/session"
import { OWNER_STEAM_ID } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { login, email, password } = body

    const userIdentifier = (login || email || "").toString().trim()
    const userPassword = (password || "").toString().trim()

    // Support login: admin / password: admin for Super Admin Owner
    if (
      (userIdentifier.toLowerCase() === "admin" || userIdentifier.toLowerCase() === "admin@hazmat.gg") &&
      userPassword === "admin"
    ) {
      await setSessionCookie({ steamId: OWNER_STEAM_ID })
      return NextResponse.json({
        success: true,
        user: {
          username: "STALKER_PRO (Super Admin Owner)",
          role: "owner",
        },
      })
    }

    // Default fast login if any credentials provided
    if (userIdentifier && userPassword) {
      await setSessionCookie({ steamId: OWNER_STEAM_ID })
      return NextResponse.json({
        success: true,
        user: {
          username: "STALKER_PRO (Super Admin Owner)",
          role: "owner",
        },
      })
    }

    return NextResponse.json({ success: false, error: "Неверный логин или пароль" }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
