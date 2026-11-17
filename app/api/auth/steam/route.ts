import { NextResponse, type NextRequest } from "next/server"

// Initiate Steam OpenID 2.0 login by redirecting to Steam.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin
  const returnTo = `${origin}/api/auth/steam/return`

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": origin,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  })

  return NextResponse.redirect(`https://steamcommunity.com/openid/login?${params.toString()}`)
}
