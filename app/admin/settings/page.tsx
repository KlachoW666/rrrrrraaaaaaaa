import { db } from "@/lib/db"
import { settings, banners, promocodes, paymentSystems } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { SettingsPanels } from "@/components/admin/settings-panels"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  let globalRtp = 95
  let bannerList: any[] = [
    { id: 1, imageUrl: "/art/promo-banner-1.png", title: "13% к пополнению", subtitle: "Промокод", link: "#", active: true },
  ]
  let promoList: any[] = [
    { id: 1, code: "HAZMAT15", amount: 15, maxUses: 1000, uses: 120, active: true },
  ]
  let paymentList: any[] = [
    { id: 1, name: "RollyPay", type: "card", hasSecret: true, active: true },
    { id: 2, name: "Crypto", type: "crypto", hasSecret: true, active: true },
  ]

  try {
    if (process.env.DATABASE_URL) {
      const [rtpRow] = await db.select().from(settings).where(eq(settings.key, "global_rtp"))
      const bannerRows = await db.select().from(banners).orderBy(desc(banners.createdAt))
      const promoRows = await db.select().from(promocodes).orderBy(desc(promocodes.createdAt))
      const paymentRows = await db.select().from(paymentSystems).orderBy(desc(paymentSystems.createdAt))

      if (rtpRow) globalRtp = Number(rtpRow.value)
      if (bannerRows && bannerRows.length > 0) {
        bannerList = bannerRows.map((b) => ({
          id: b.id,
          imageUrl: b.imageUrl,
          title: b.title,
          subtitle: b.subtitle,
          link: b.link,
          active: b.active,
        }))
      }
      if (promoRows && promoRows.length > 0) {
        promoList = promoRows.map((p) => ({
          id: p.id,
          code: p.code,
          amount: Number(p.amount),
          maxUses: p.maxUses,
          uses: p.uses,
          active: p.active,
        }))
      }
      if (paymentRows && paymentRows.length > 0) {
        paymentList = paymentRows.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          hasSecret: !!p.secretKey,
          active: p.active,
        }))
      }
    }
  } catch (e) {
    // DB offline fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Настройки сайта</h1>
        <p className="text-sm text-muted-foreground">
          Баннеры главной, глобальный RTP, промокоды и платёжные системы.
        </p>
      </div>
      <SettingsPanels
        globalRtp={globalRtp}
        banners={bannerList}
        promos={promoList}
        payments={paymentList}
      />
    </div>
  )
}
