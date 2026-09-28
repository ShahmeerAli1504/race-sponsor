-- ============================================================================
-- RACE SPONSOR / SKINBID-STYLE ATHLETE SPONSORSHIP AUCTION MARKETPLACE
-- Database DDL Specification for Supabase (PostgreSQL)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLE: ATHLETE_APPLICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.athlete_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    sport TEXT NOT NULL,
    target_event TEXT NOT NULL,
    race_date DATE NOT NULL,
    gym_affiliation TEXT,
    instagram_handle TEXT,
    athletic_bio TEXT,
    requested_placement TEXT NOT NULL,
    fee_paid BOOLEAN DEFAULT false,
    status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. TABLE: EVENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    sport TEXT NOT NULL,
    location TEXT NOT NULL,
    race_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. TABLE: ATHLETES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.athletes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    cover_image_url TEXT,
    bio TEXT NOT NULL,
    hometown TEXT NOT NULL,
    home_gym TEXT NOT NULL,
    business_affiliations TEXT,
    instagram_url TEXT,
    strava_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. TABLE: LISTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    placement_zone TEXT NOT NULL CHECK (placement_zone IN ('chest', 'shoulder_left', 'shoulder_right', 'back_singlet', 'quad', 'headwear', 'social_only')),
    decal_specs TEXT NOT NULL,
    social_deliverables JSONB NOT NULL DEFAULT '{"stories": 3, "feed_posts": 1}'::jsonb,
    starting_bid NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    current_bid NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    bids_close_at TIMESTAMPTZ NOT NULL, -- Exactly 14 days before event.race_date
    status TEXT CHECK (status IN ('DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED')) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. TABLE: BIDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    bidder_name TEXT NOT NULL,
    bidder_company TEXT NOT NULL,
    bidder_email TEXT NOT NULL,
    bidder_phone TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ANTI-SNIPING ENGINE TRIGGER & FUNCTION
-- If a bid is submitted when (bids_close_at - NOW() < 60 seconds),
-- extend bids_close_at by 60 seconds automatically.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_bid_anti_sniping()
RETURNS TRIGGER AS $$
DECLARE
    v_bids_close_at TIMESTAMPTZ;
    v_time_remaining INTERVAL;
    v_new_close_at TIMESTAMPTZ;
BEGIN
    -- Fetch the current auction cutoff time
    SELECT bids_close_at INTO v_bids_close_at
    FROM public.listings
    WHERE id = NEW.listing_id;

    IF v_bids_close_at IS NOT NULL THEN
        v_time_remaining := v_bids_close_at - NEW.created_at;

        -- Anti-sniping condition: remaining time is less than 60 seconds
        IF v_time_remaining < INTERVAL '60 SECONDS' THEN
            v_new_close_at := v_bids_close_at + INTERVAL '60 SECONDS';
            
            UPDATE public.listings
            SET 
                bids_close_at = v_new_close_at,
                current_bid = GREATEST(current_bid, NEW.amount)
            WHERE id = NEW.listing_id;
        ELSE
            UPDATE public.listings
            SET current_bid = GREATEST(current_bid, NEW.amount)
            WHERE id = NEW.listing_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if re-running migration
DROP TRIGGER IF EXISTS trg_anti_sniping_bid ON public.bids;

CREATE TRIGGER trg_anti_sniping_bid
AFTER INSERT ON public.bids
FOR EACH ROW
EXECUTE FUNCTION public.process_bid_anti_sniping();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.athlete_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- PUBLIC ACCESS POLICIES:
-- 1. Anyone can view active listings, events, athletes, and bids
CREATE POLICY "Public Read Listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Athletes" ON public.athletes FOR SELECT USING (true);
CREATE POLICY "Public Read Bids" ON public.bids FOR SELECT USING (true);

-- 2. Anyone can submit an athlete application
CREATE POLICY "Public Submit Applications" ON public.athlete_applications FOR INSERT WITH CHECK (true);

-- 3. Anyone can place a bid on active listings
CREATE POLICY "Public Submit Bids" ON public.bids FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS POLICIES (Supabase authenticated admin role or service role):
CREATE POLICY "Admin All Applications" ON public.athlete_applications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Athletes" ON public.athletes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Listings" ON public.listings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Bids" ON public.bids FOR ALL USING (auth.role() = 'authenticated');


-- ============================================================================
-- SEED DATA (REALISTIC MOCK DATASET)
-- Includes Reno-based athlete for HYROX Anaheim (Dec 6 2026), Grind Human Performance,
-- The Compound Coffee, and 2-week pre-race bidding cutoff.
-- ============================================================================

-- Seed Event: HYROX Anaheim 2026
INSERT INTO public.events (id, title, sport, location, race_date) VALUES
('e1111111-1111-1111-1111-111111111111', 'HYROX Anaheim 2026', 'HYROX', 'Anaheim Convention Center, CA', '2026-12-06 08:00:00+00'),
('e2222222-2222-2222-2222-222222222222', 'CrossFit Games Championship', 'CrossFit', 'Fort Worth Arena, TX', '2026-11-20 09:00:00+00'),
('e3333333-3333-3333-3333-333333333333', 'Ironman California Triathlon', 'Triathlon', 'Sacramento, CA', '2026-10-25 06:30:00+00'),
('e4444444-4444-4444-4444-444444444444', 'Superpro Muay Thai GP', 'Combat', 'Las Vegas, NV', '2026-11-14 19:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Seed Athlete: Marcus Vance (Reno, NV / Grind Human Performance / The Compound Coffee)
INSERT INTO public.athletes (id, name, avatar_url, cover_image_url, bio, hometown, home_gym, business_affiliations, instagram_url, strava_url) VALUES
('a1111111-1111-1111-1111-111111111111', 'Marcus Vance', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80', 'Former Division I soccer star turned elite HYROX Pro athlete. Training 25+ hours weekly at Grind Human Performance in Reno. Co-founder of The Compound Coffee.', 'Reno, NV', 'Grind Human Performance', 'The Compound Coffee', 'https://instagram.com/marcusvance_hyrox', 'https://strava.com/athletes/marcusvance'),
('a2222222-2222-2222-2222-222222222222', 'Elena Rostova', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1600&q=80', '2x Regional CrossFit Podium Finisher and tactical endurance specialist. Known for relentless work ethic and massive social engagement.', 'San Diego, CA', 'Invictus Fitness', 'Apex Recovery Lab', 'https://instagram.com/elena_crossfit', 'https://strava.com/athletes/elenarostova'),
('a3333333-3333-3333-3333-333333333333', 'Devon MacIntyre', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80', 'Ironman All-World Athlete and sub-9 hour triathlon racer. High visibility on race singlet chest placement during televised broadcast streams.', 'Austin, TX', 'Onnit Gym Austin', 'VeloCraft Bikes', 'https://instagram.com/devon_triathlon', 'https://strava.com/athletes/devonmacintyre')
ON CONFLICT (id) DO NOTHING;

-- Seed Listing: Marcus Vance HYROX Anaheim Right Deltoid Decal
-- Bids close exactly 14 days before Dec 6 2026 = Nov 22 2026
INSERT INTO public.listings (id, athlete_id, event_id, title, placement_zone, decal_specs, social_deliverables, starting_bid, current_bid, bids_close_at, status) VALUES
('l1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'Marcus Vance - HYROX Anaheim Right Deltoid Decal Slot', 'shoulder_right', '4x4 inches High-Adhesion Sweatproof Temporary Tattoo Decal', '{"stories": 4, "feed_posts": 2, "reels": 1}'::jsonb, 50.00, 275.00, '2026-11-22 08:00:00+00', 'ACTIVE'),
('l2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'Elena Rostova - CrossFit Games Center Chest Placement', 'chest', '5x3 inches Sweat-Resistant Fabric Decal + Singlet Placement', '{"stories": 3, "feed_posts": 1, "reels": 1}'::jsonb, 50.00, 420.00, '2026-11-06 09:00:00+00', 'ACTIVE'),
('l3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', 'Devon MacIntyre - Ironman CA Aero Singlet Back Placement', 'back_singlet', '6x4 inches High-Visibility Reflective Sublimated Patch', '{"stories": 5, "feed_posts": 2, "reels": 2}'::jsonb, 50.00, 350.00, '2026-10-11 06:30:00+00', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Seed Bids
INSERT INTO public.bids (id, listing_id, bidder_name, bidder_company, bidder_email, bidder_phone, amount, created_at) VALUES
('b1111111-1111-1111-1111-111111111111', 'l1111111-1111-1111-1111-111111111111', 'Derek Vance', 'HydratePro Electrolytes', 'derek@hydratepro.com', '+1-555-0192', 100.00, now() - INTERVAL '3 days'),
('b2222222-2222-2222-2222-222222222222', 'l1111111-1111-1111-1111-111111111111', 'Sarah Jenkins', 'Kilo Wear Gear', 's.jenkins@kilowear.com', '+1-555-0284', 200.00, now() - INTERVAL '1 day'),
('b3333333-3333-3333-3333-333333333333', 'l1111111-1111-1111-1111-111111111111', 'Alex Mercer', 'Apex Recovery Labs', 'alex@apexrecovery.com', '+1-555-0371', 275.00, now() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;
