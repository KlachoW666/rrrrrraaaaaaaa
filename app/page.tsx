import { PromoHero } from "@/components/promo-hero"
import { CaseGrid } from "@/components/case-grid"
import { SectionTitle } from "@/components/section-title"
import { AllCasesSection } from "@/components/all-cases-section"
import { limitedCases, kabanCases } from "@/lib/data"
import { db } from "@/lib/db"
import { banners } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

const defaultBanners = [
  {
    id: 1,
    imageUrl: "/art/promo-banner-1.png",
    title: "13% к пополнению",
    subtitle: "Скопировать промокод",
    link: "#",
  },
  {
    id: 2,
    imageUrl: "/art/promo-banner-2.png",
    title: "Кейсы с самым высоким RTP",
    subtitle: "Проверь свою удачу",
    link: "#",
  },
  {
    id: 3,
    imageUrl: "/art/promo-banner-3.png",
    title: "Разыграли 1 000 000 ₽",
    subtitle: "Проверь себя в списках",
    link: "#",
  },
]

export default async function Page() {
  let heroBanners = defaultBanners

  try {
    if (process.env.DATABASE_URL) {
      const activeBanners = await db
        .select()
        .from(banners)
        .where(eq(banners.active, true))
        .orderBy(asc(banners.position), asc(banners.id))

      if (activeBanners && Array.isArray(activeBanners) && activeBanners.length > 0) {
        heroBanners = activeBanners.map((b) => ({
          id: b.id,
          imageUrl: b.imageUrl,
          title: b.title,
          subtitle: b.subtitle,
          link: b.link,
        }))
      }
    }
  } catch (err) {
    // Database query failed (Postgres offline or no connection), use fallback banners
  }

  return (
    <div className="flex flex-col gap-12">
      <PromoHero banners={heroBanners} />

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionTitle title="Лимитированная серия" subtitle="Успей открыть, пока кейсы доступны" />
        <div className="mt-4">
          <CaseGrid items={limitedCases} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionTitle title="HAZMAT" subtitle="Легендарные выжившие в деле" mascot />
        <div className="mt-4">
          <CaseGrid items={kabanCases} />
        </div>
      </section>

      <AllCasesSection />
    </div>
  )
}
