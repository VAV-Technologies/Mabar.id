-- Mabar Seed Data
-- Sample cafes and restaurants for testing

-- Insert sample places (Jakarta area)
INSERT INTO public.places (name, address, latitude, longitude, category, rating, price_level, photo_url) VALUES
-- Cafes
('Kopi Kenangan', 'Jl. Sudirman No. 45, Jakarta Pusat', -6.2088, 106.8456, 'cafe', 4.5, 2, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400'),
('Starbucks Reserve', 'Pacific Place Mall, SCBD, Jakarta', -6.2244, 106.8094, 'cafe', 4.3, 3, 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400'),
('Anomali Coffee', 'Jl. Kemang Raya No. 72, Jakarta Selatan', -6.2612, 106.8145, 'cafe', 4.6, 2, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
('Fore Coffee', 'Grand Indonesia Mall, Jakarta Pusat', -6.1952, 106.8214, 'cafe', 4.4, 2, 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400'),
('Titik Temu Coffee', 'Jl. Cipete Raya No. 12, Jakarta Selatan', -6.2789, 106.7967, 'cafe', 4.7, 2, 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400'),

-- Restaurants
('Sate Khas Senayan', 'Jl. Senayan No. 78, Jakarta Selatan', -6.2345, 106.7987, 'restaurant', 4.4, 2, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'),
('Sushi Tei', 'Plaza Indonesia, Jakarta Pusat', -6.1934, 106.8221, 'restaurant', 4.3, 3, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'),
('Plataran Menteng', 'Jl. HOS Cokroaminoto No. 42, Jakarta Pusat', -6.1889, 106.8345, 'restaurant', 4.6, 4, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'),
('Nasi Goreng Kambing Kebon Sirih', 'Jl. Kebon Sirih No. 31, Jakarta Pusat', -6.1823, 106.8298, 'restaurant', 4.5, 1, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'),
('Bakmi GM', 'Jl. Melawai Raya No. 45, Jakarta Selatan', -6.2456, 106.7978, 'restaurant', 4.2, 2, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'),

-- Bars
('Skye Bar & Restaurant', 'Menara BCA Lt. 56, Jakarta Pusat', -6.2256, 106.8089, 'bar', 4.4, 4, 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400'),
('Cloud Lounge & Living Room', 'The Plaza, Jl. MH Thamrin, Jakarta Pusat', -6.1945, 106.8234, 'bar', 4.3, 4, 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400'),
('Lucy in the Sky', 'Fairmont Hotel, Jakarta Pusat', -6.1967, 106.8212, 'bar', 4.5, 4, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400'),

-- Bakeries
('Tous Les Jours', 'Central Park Mall, Jakarta Barat', -6.1767, 106.7912, 'bakery', 4.3, 2, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
('BreadTalk', 'Grand Indonesia Mall, Jakarta Pusat', -6.1956, 106.8198, 'bakery', 4.1, 2, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
('Beau Bakery', 'Jl. Gunawarman No. 32, Jakarta Selatan', -6.2389, 106.7823, 'bakery', 4.6, 3, 'https://images.unsplash.com/photo-1486427944544-d2c21d57c4dc?w=400');

-- Insert voucher templates
INSERT INTO public.voucher_templates (place_id, discount_type, discount_value, title_en, title_id, description_en, description_id, terms_en, terms_id, min_purchase, max_discount, valid_for, validity_hours)
SELECT
  p.id,
  CASE (random() * 2)::int
    WHEN 0 THEN 'percentage'
    WHEN 1 THEN 'fixed'
    ELSE 'freebie'
  END,
  CASE (random() * 2)::int
    WHEN 0 THEN 10 + (random() * 20)::int -- 10-30%
    WHEN 1 THEN 10000 + (random() * 40000)::int -- 10k-50k
    ELSE 1
  END,
  CASE (random() * 2)::int
    WHEN 0 THEN (10 + (random() * 20)::int)::text || '% Off'
    WHEN 1 THEN 'Rp ' || (10 + (random() * 40)::int)::text || 'K Off'
    ELSE 'Free Drink'
  END,
  CASE (random() * 2)::int
    WHEN 0 THEN 'Diskon ' || (10 + (random() * 20)::int)::text || '%'
    WHEN 1 THEN 'Potongan Rp ' || (10 + (random() * 40)::int)::text || '.000'
    ELSE 'Gratis Minuman'
  END,
  'Get this exclusive discount on your next visit!',
  'Dapatkan diskon eksklusif untuk kunjunganmu berikutnya!',
  'Valid for dine-in and takeaway. Cannot be combined with other promotions.',
  'Berlaku untuk makan di tempat dan bawa pulang. Tidak dapat digabung dengan promo lain.',
  50000,
  100000,
  'both',
  24
FROM public.places p;

-- Add another set of voucher templates with different values
INSERT INTO public.voucher_templates (place_id, discount_type, discount_value, title_en, title_id, description_en, description_id, terms_en, terms_id, min_purchase, max_discount, valid_for, validity_hours)
SELECT
  p.id,
  'percentage',
  15,
  '15% Weekend Special',
  'Spesial Akhir Pekan 15%',
  'Special weekend discount for Mabar users!',
  'Diskon spesial akhir pekan untuk pengguna Mabar!',
  'Valid on weekends only. Min purchase Rp 75,000.',
  'Berlaku hanya di akhir pekan. Min. pembelian Rp 75.000.',
  75000,
  50000,
  'dine_in',
  48
FROM public.places p
WHERE p.category IN ('restaurant', 'cafe');
