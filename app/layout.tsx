import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import NewsletterFooterBar from '@/components/NewsletterFooterBar'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: 'Find a Geriatrician Near You | GeriatricianDirectory.com',
    template: '%s | GeriatricianDirectory.com',
  },
  description:
    'Find a board-certified geriatrician near you. Search by city, state, insurance, or specialty. Expert care for older adults and their families.',
  keywords: [
    'geriatrician',
    'geriatric doctor',
    'elderly care specialist',
    'find a geriatrician',
    'geriatrician near me',
    'aging care doctor',
    'memory care specialist',
  ],
  authors: [{ name: 'GeriatricianDirectory.com' }],
  creator: 'GeriatricianDirectory.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geriatriciandirectory.com',
    siteName: 'GeriatricianDirectory.com',
    title: 'Find a Geriatrician Near You | GeriatricianDirectory.com',
    description:
      'Find a board-certified geriatrician near you. Search by city, insurance, and specialty. Free to search, free to list.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find a Geriatrician Near You | GeriatricianDirectory.com',
    description: 'Find a board-certified geriatrician near you.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geriatriciandirectory.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <NewsletterFooterBar />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
