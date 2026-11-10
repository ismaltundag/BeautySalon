-- Run once against a dedicated Neon database. Prices are stored in USD cents.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS site_settings (
 id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id=1),
 brand TEXT NOT NULL DEFAULT 'MAISON BELLE',
 headline TEXT NOT NULL DEFAULT 'The art of feeling beautiful.',
 tagline TEXT NOT NULL DEFAULT 'Thoughtful rituals, expert hands, and a little time just for you.',
 accent TEXT NOT NULL DEFAULT '#394438',
 announcement TEXT NOT NULL DEFAULT 'WELCOME TO MAISON BELLE',
 about TEXT NOT NULL DEFAULT '',
 membership_title TEXT NOT NULL DEFAULT 'A little more of what you love.',
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO site_settings(id) VALUES (1) ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS services (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
 price_cents INTEGER NOT NULL CHECK(price_cents>=0), duration_minutes INTEGER NOT NULL CHECK(duration_minutes>0),
 image_url TEXT, active BOOLEAN NOT NULL DEFAULT true, sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS staff (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, bio TEXT NOT NULL DEFAULT '',
 active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS staff_services (
 staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
 service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
 PRIMARY KEY(staff_id,service_id)
);
CREATE TABLE IF NOT EXISTS customers (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, email TEXT NOT NULL,
 phone TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS appointment_requests (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 customer_id UUID NOT NULL REFERENCES customers(id),
 service_id UUID NOT NULL REFERENCES services(id),
 staff_id UUID REFERENCES staff(id),
 preferred_start TIMESTAMPTZ NOT NULL,
 notes TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','declined','cancelled')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS appointment_requests_start_idx ON appointment_requests(preferred_start);
CREATE TABLE IF NOT EXISTS products (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
 price_cents INTEGER NOT NULL CHECK(price_cents>=0),
 inventory INTEGER NOT NULL DEFAULT 0 CHECK(inventory>=0),
 image_url TEXT, active BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS memberships (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '', monthly_price_cents INTEGER NOT NULL CHECK(monthly_price_cents>=0),
 active BOOLEAN NOT NULL DEFAULT true
);
-- Orders, payment intents, subscriptions and confirmed slot locking are intentionally not implemented yet.

-- Premium salon CMS additions (safe to re-run).
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS specialty TEXT NOT NULL DEFAULT '';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS details TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS preparation TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS aftercare TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS gallery_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL,
 category TEXT NOT NULL DEFAULT 'Our Work', image_url TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0,
 active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
