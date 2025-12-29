-- Mabar Database Schema
-- Initial migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ===========================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ===========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'id')),
  theme VARCHAR(10) DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'cream')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ===========================================
-- PLACES TABLE
-- ===========================================
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location GEOGRAPHY(POINT, 4326), -- PostGIS geography for spatial queries
  category VARCHAR(50) CHECK (category IN ('cafe', 'restaurant', 'bar', 'bakery')),
  rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
  price_level INT CHECK (price_level >= 1 AND price_level <= 4),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index
CREATE INDEX places_location_idx ON public.places USING GIST (location);
CREATE INDEX places_category_idx ON public.places (category);
CREATE INDEX places_is_active_idx ON public.places (is_active);

-- Trigger to auto-update location from lat/lng
CREATE OR REPLACE FUNCTION public.update_place_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_update_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.update_place_location();

-- Enable RLS
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Policies (places are publicly readable)
CREATE POLICY "Places are viewable by everyone"
  ON public.places FOR SELECT
  USING (true);

-- ===========================================
-- VOUCHER TEMPLATES TABLE
-- ===========================================
CREATE TABLE public.voucher_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES public.places ON DELETE CASCADE,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'freebie')),
  discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
  title_en VARCHAR(255) NOT NULL,
  title_id VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_id TEXT,
  terms_en TEXT,
  terms_id TEXT,
  min_purchase DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  valid_for VARCHAR(20) DEFAULT 'both' CHECK (valid_for IN ('dine_in', 'takeaway', 'both')),
  validity_hours INT DEFAULT 24 CHECK (validity_hours > 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX voucher_templates_place_id_idx ON public.voucher_templates (place_id);
CREATE INDEX voucher_templates_is_active_idx ON public.voucher_templates (is_active);

-- Enable RLS
ALTER TABLE public.voucher_templates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Voucher templates are viewable by authenticated users"
  ON public.voucher_templates FOR SELECT
  TO authenticated
  USING (true);

-- ===========================================
-- USER VOUCHERS TABLE
-- ===========================================
CREATE TABLE public.user_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  voucher_template_id UUID REFERENCES public.voucher_templates ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES public.places ON DELETE CASCADE NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX user_vouchers_user_id_idx ON public.user_vouchers (user_id);
CREATE INDEX user_vouchers_status_idx ON public.user_vouchers (status);
CREATE INDEX user_vouchers_expires_at_idx ON public.user_vouchers (expires_at);

-- Enable RLS
ALTER TABLE public.user_vouchers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own vouchers"
  ON public.user_vouchers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vouchers"
  ON public.user_vouchers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vouchers"
  ON public.user_vouchers FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- SPIN HISTORY TABLE
-- ===========================================
CREATE TABLE public.spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES public.places ON DELETE CASCADE NOT NULL,
  voucher_id UUID REFERENCES public.user_vouchers ON DELETE SET NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_km DECIMAL(5, 2) NOT NULL,
  spun_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX spin_history_user_id_idx ON public.spin_history (user_id);
CREATE INDEX spin_history_spun_at_idx ON public.spin_history (spun_at);

-- Enable RLS
ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own spin history"
  ON public.spin_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spin history"
  ON public.spin_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- USER DAILY SPINS TABLE
-- ===========================================
CREATE TABLE public.user_daily_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  spin_date DATE NOT NULL,
  spins_used INT DEFAULT 0,
  max_spins INT DEFAULT 3,
  UNIQUE(user_id, spin_date)
);

CREATE INDEX user_daily_spins_user_date_idx ON public.user_daily_spins (user_id, spin_date);

-- Enable RLS
ALTER TABLE public.user_daily_spins ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own daily spins"
  ON public.user_daily_spins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily spins"
  ON public.user_daily_spins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily spins"
  ON public.user_daily_spins FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to get nearby places
CREATE OR REPLACE FUNCTION public.get_nearby_places(
  lat DECIMAL,
  lng DECIMAL,
  radius_km DECIMAL,
  category_filter VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  category VARCHAR,
  rating DECIMAL,
  price_level INT,
  photo_url TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.address,
    p.latitude,
    p.longitude,
    p.category,
    p.rating,
    p.price_level,
    p.photo_url,
    ROUND((ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000)::DECIMAL, 2) as distance_km
  FROM public.places p
  WHERE p.is_active = true
    AND ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
    AND (category_filter IS NULL OR category_filter = 'all' OR p.category = category_filter)
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate voucher code
CREATE OR REPLACE FUNCTION public.generate_voucher_code()
RETURNS VARCHAR AS $$
DECLARE
  chars VARCHAR := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result VARCHAR := '';
  i INT;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to claim a voucher
CREATE OR REPLACE FUNCTION public.claim_voucher(
  p_user_id UUID,
  p_place_id UUID,
  p_template_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_voucher_id UUID;
  v_code VARCHAR;
  v_validity_hours INT;
BEGIN
  -- Get validity hours from template
  SELECT validity_hours INTO v_validity_hours
  FROM public.voucher_templates
  WHERE id = p_template_id AND is_active = true;

  IF v_validity_hours IS NULL THEN
    RAISE EXCEPTION 'Invalid voucher template';
  END IF;

  -- Generate unique code
  LOOP
    v_code := public.generate_voucher_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.user_vouchers WHERE code = v_code);
  END LOOP;

  -- Create voucher
  INSERT INTO public.user_vouchers (
    user_id,
    voucher_template_id,
    place_id,
    code,
    expires_at
  ) VALUES (
    p_user_id,
    p_template_id,
    p_place_id,
    v_code,
    NOW() + (v_validity_hours || ' hours')::INTERVAL
  ) RETURNING id INTO v_voucher_id;

  RETURN v_voucher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use a voucher
CREATE OR REPLACE FUNCTION public.use_voucher(p_voucher_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_status VARCHAR;
  v_expires_at TIMESTAMPTZ;
BEGIN
  SELECT status, expires_at INTO v_status, v_expires_at
  FROM public.user_vouchers
  WHERE id = p_voucher_id AND user_id = auth.uid();

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'Voucher not found';
  END IF;

  IF v_status != 'active' THEN
    RAISE EXCEPTION 'Voucher is not active';
  END IF;

  IF v_expires_at < NOW() THEN
    UPDATE public.user_vouchers SET status = 'expired' WHERE id = p_voucher_id;
    RAISE EXCEPTION 'Voucher has expired';
  END IF;

  UPDATE public.user_vouchers
  SET status = 'used', used_at = NOW()
  WHERE id = p_voucher_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check/increment daily spins
CREATE OR REPLACE FUNCTION public.check_and_use_spin(p_user_id UUID)
RETURNS TABLE (can_spin BOOLEAN, spins_remaining INT) AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_spins_used INT;
  v_max_spins INT;
BEGIN
  -- Get or create today's spin record
  INSERT INTO public.user_daily_spins (user_id, spin_date, spins_used, max_spins)
  VALUES (p_user_id, v_today, 0, 3)
  ON CONFLICT (user_id, spin_date) DO NOTHING;

  SELECT uds.spins_used, uds.max_spins INTO v_spins_used, v_max_spins
  FROM public.user_daily_spins uds
  WHERE uds.user_id = p_user_id AND uds.spin_date = v_today;

  IF v_spins_used < v_max_spins THEN
    UPDATE public.user_daily_spins
    SET spins_used = spins_used + 1
    WHERE user_id = p_user_id AND spin_date = v_today;

    RETURN QUERY SELECT true, (v_max_spins - v_spins_used - 1);
  ELSE
    RETURN QUERY SELECT false, 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Job to expire vouchers (run periodically)
CREATE OR REPLACE FUNCTION public.expire_vouchers()
RETURNS INT AS $$
DECLARE
  v_count INT;
BEGIN
  UPDATE public.user_vouchers
  SET status = 'expired'
  WHERE status = 'active' AND expires_at < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
