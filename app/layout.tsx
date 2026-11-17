import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/app-shell'
import { getCurrentUser } from '@/lib/auth'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'HAZMAT.GG — Открывай кейсы Rust',
  description:
    'Открывай кейсы Rust, участвуй в замесах и апгрейдь свои предметы на HAZMAT.GG',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111211',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const current = await getCurrentUser()
  const initialUser = current
    ? {
        id: current.id,
        username: current.username,
        avatar: current.avatar,
        role: current.role,
        balance: Number(current.balance),
      }
    : null

  return (
    <html lang="ru" className={`dark ${montserrat.variable}`}>
      <body className="bg-background font-sans antialiased">
        <AppShell initialUser={initialUser}>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
