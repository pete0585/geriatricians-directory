-- GeriatricianDirectory.com Initial Schema
-- Supabase project: fbuqrnzofktepkzyfmhy (shared Directories project)
-- All tables prefixed with geriatrician_

-- Geriatrician Listings
CREATE TABLE IF NOT EXISTS public.geriatrician_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  npi TEXT UNIQUE,
  full_name TEXT NOT NULL,
  credentials TEXT,
  practice_name TEXT,
  bio TEXT,
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address_line1 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  subspecialties TEXT[] DEFAULT '{}',
  conditions_treated TEXT[] DEFAULT '{}',
  insurance_accepted TEXT[] DEFAULT '{}',
  is_accepting_new_patients BOOLEAN,
  offers_telehealth BOOLEAN NOT NULL DEFAULT false,
  is_abim_certified BOOLEAN NOT NULL DEFAULT false,
  is_ags_member BOOLEAN NOT NULL DEFAULT false,
  listing_tier TEXT NOT NULL DEFAULT 'free',
  listing_tier_rank INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  claimed_by TEXT,
  source TEXT,
  do_not_email BOOLEAN NOT NULL DEFAULT false,
  outreach_sent_at TIMESTAMPTZ,
  outreach_last_sent_at TIMESTAMPTZ,
  nudge_sent_at TIMESTAMPTZ,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Geriatrician Claims
CREATE TABLE IF NOT EXISTS public.geriatrician_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.geriatrician_listings(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '72 hours'),
  nudge_sent_at TIMESTAMPTZ
);

-- Geriatrician Payments
CREATE TABLE IF NOT EXISTS public.geriatrician_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.geriatrician_listings(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Geriatrician Inquiries (for future lead routing revenue)
CREATE TABLE IF NOT EXISTS public.geriatrician_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name TEXT,
  family_phone TEXT,
  family_email TEXT,
  patient_age INTEGER,
  patient_situation TEXT,
  state TEXT,
  city TEXT,
  insurance TEXT,
  routed_to UUID REFERENCES public.geriatrician_listings(id),
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_city ON public.geriatrician_listings(city);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_state ON public.geriatrician_listings(state);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_tier ON public.geriatrician_listings(listing_tier);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_active ON public.geriatrician_listings(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_npi ON public.geriatrician_listings(npi);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_claimed ON public.geriatrician_listings(claimed_at);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_search ON public.geriatrician_listings USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_subspecialties ON public.geriatrician_listings USING GIN(subspecialties);
CREATE INDEX IF NOT EXISTS idx_geriatrician_listings_accepting ON public.geriatrician_listings(is_accepting_new_patients);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER geriatrician_listings_updated_at
  BEFORE UPDATE ON public.geriatrician_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Search vector trigger
CREATE OR REPLACE FUNCTION public.geriatrician_listings_search_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.full_name, '') || ' ' ||
    COALESCE(NEW.practice_name, '') || ' ' ||
    COALESCE(NEW.city, '') || ' ' ||
    COALESCE(NEW.state, '') || ' ' ||
    COALESCE(ARRAY_TO_STRING(NEW.subspecialties, ' '), '') || ' ' ||
    COALESCE(NEW.bio, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER geriatrician_listings_search_update
  BEFORE INSERT OR UPDATE ON public.geriatrician_listings
  FOR EACH ROW EXECUTE FUNCTION public.geriatrician_listings_search_trigger();

-- Row-Level Security
ALTER TABLE public.geriatrician_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geriatrician_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geriatrician_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geriatrician_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for approved listings
CREATE POLICY "Public read geriatrician_listings"
  ON public.geriatrician_listings
  FOR SELECT
  USING (is_active = true AND is_approved = true);

-- Service role full access
CREATE POLICY "Service role full access geriatrician_listings"
  ON public.geriatrician_listings
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access geriatrician_claims"
  ON public.geriatrician_claims
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access geriatrician_payments"
  ON public.geriatrician_payments
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access geriatrician_inquiries"
  ON public.geriatrician_inquiries
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Grants
GRANT SELECT ON public.geriatrician_listings TO anon, authenticated;
GRANT ALL ON public.geriatrician_listings TO service_role;
GRANT ALL ON public.geriatrician_claims TO service_role;
GRANT ALL ON public.geriatrician_payments TO service_role;
GRANT ALL ON public.geriatrician_inquiries TO service_role;
