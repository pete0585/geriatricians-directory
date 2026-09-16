import EditorialLink from 'next/link'
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'GeriatricianDirectory.com — Find Board-Certified Geriatricians Near You',
    template: '%s | GeriatricianDirectory.com',
  },
  description:
    'Search the most complete directory of board-certified geriatricians in the US. Filter by location, specialty, telehealth availability, and accepting new patients.',
  keywords: ['geriatrician', 'geriatric doctor', 'senior care specialist', 'geriatric medicine', 'board certified geriatrician'],
  openGraph: {
    siteName: 'GeriatricianDirectory.com',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://geriatriciandirectory.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}<nav aria-label="Editorial guides" className="mx-auto max-w-7xl px-6 py-6"><EditorialLink href="/blog" className="underline underline-offset-4">Guides and articles</EditorialLink></nav></main>
        <Footer />
      </body>
    </html>
  )
}
