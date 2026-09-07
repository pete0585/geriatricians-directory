import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { cityPageMetadata } from "@/lib/city-pages"

export const metadata = cityPageMetadata(
  "austin-tx",
  "Best Geriatrician in Austin, TX | Geriatrician Directory",
  "Find geriatrician in Austin, Texas. 37+ listed. Filter by city and compare providers.",
)

async function getListings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("geriatrician_listings")
    .select("*")
    .eq("city", "Austin")
    .eq("state", "TX")
    .eq("is_active", true)
    .limit(24)
  return data ?? []
}

function listingName(row: Record<string, unknown>) {
  return (
    (row["full_name"] as string) ||
    (row.name as string) ||
    (row.full_name as string) ||
    (row.clinic_name as string) ||
    "Listing"
  )
}

function listingHref(row: Record<string, unknown>) {
  const slug = String(row.slug || "")
  return "/listings/SLUG".replace("SLUG", slug)
}

export default async function CityPage() {
  const listings = await getListings()
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many geriatrician are in Austin, TX?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Geriatrician Directory lists 37+ geriatrician in Austin, Texas. Counts change as new listings are seeded.",
        },
      },
      {
        "@type": "Question",
        name: "How do I find geriatrician in Austin?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Search geriatriciandirectory.com and filter by Austin. Compare listed providers, then contact the one that fits.",
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-neutral-500">Austin, TX</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Geriatrician in Austin, TX
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          37+ listed geriatrician in the Austin area. Pages are generated from live directory listings — not outreach.
        </p>
        <p className="mt-2 text-sm text-neutral-500">{listings.length} shown on this page.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {listings.map((row: Record<string, unknown>, i: number) => (
            <li key={String(row.id || row.slug || i)} className="rounded-xl border border-neutral-200 p-4">
              <Link href={listingHref(row)} className="font-semibold hover:underline">
                {listingName(row)}
              </Link>
              <p className="mt-1 text-sm text-neutral-500">
                {String(row.city || "Austin")}, {String(row.state || "TX")}
              </p>
            </li>
          ))}
        </ul>
        {listings.length === 0 && (
          <p className="mt-8 text-neutral-500">Listings for this city are still being seeded.</p>
        )}
      </main>
    </>
  )
}
