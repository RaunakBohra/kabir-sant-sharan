-- Seed D1 Database with Minimal Sample Data
-- Run with: wrangler d1 execute kabir-sant-sharan --remote --file=drizzle/seed-d1.sql

-- 1. Insert Quote
INSERT INTO quotes (id, content, translation, author, source, category, tags, language, featured, active, display_date, views, likes, created_at, updated_at)
VALUES (
  'nlayyglnw4aw10rp9aojme8x',
  'जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।',
  'Those who searched, found the truth by diving deep. I, a coward, feared drowning and remained sitting on the shore.',
  'Sant Kabir Das',
  'Kabir Bijak',
  'wisdom',
  'search,truth,courage,wisdom',
  'hi',
  1,
  1,
  date('now'),
  0,
  0,
  datetime('now'),
  datetime('now')
);

-- 2. Insert Teaching
INSERT INTO teachings (id, title, content, excerpt, slug, category, tags, author, published, featured, views, likes, language, translation_of, cover_image, reading_time, published_at, deleted_at, created_at, updated_at)
VALUES (
  'nmh48g61oquj4dtvnuunaufr',
  'The Path of Divine Love (प्रेम का मार्ग)',
  'Sant Kabir teaches us that the path to the divine is through pure love and devotion.

True spirituality is not about rituals, but about the sincere love in your heart. When you love the divine with all your being, all barriers dissolve.

प्रेम गली अति सांकरी, ता में दो न समाहिं।
जब मैं था तब हरि नहीं, अब हरि हैं मैं नाहिं॥

The lane of love is very narrow, two cannot fit there together. When I existed, God was not there; now that God exists, I am no more.

This teaching reminds us that true spiritual union requires the dissolution of ego. In the presence of divine love, the individual self must surrender completely.',
  'Sant Kabir teaches that the path to the divine is through pure love and devotion, requiring the complete dissolution of ego.',
  'the-path-of-divine-love',
  'Philosophy',
  'love,devotion,ego,spirituality',
  'Sant Kabir Das',
  1,
  1,
  0,
  0,
  'en',
  NULL,
  NULL,
  3,
  datetime('now'),
  NULL,
  datetime('now'),
  datetime('now')
);

-- 3. Insert Event (7 days from now)
INSERT INTO events (id, title, description, slug, type, location, virtual_link, max_attendees, current_attendees, start_date, end_date, start_time, end_time, timezone, featured, published, registration_required, registration_deadline, category, tags, cover_image, organizer, language, deleted_at, created_at, updated_at)
VALUES (
  'lsh99sbo86y0i7dd60r4ctyk',
  'Weekly Satsang - Kabir Teachings',
  'Join us for a weekly spiritual gathering where we explore the profound teachings of Sant Kabir Das. Through devotional songs, discussions, and meditation, we come together as a community to deepen our understanding of his timeless wisdom.',
  'weekly-satsang-kabir-teachings',
  'satsang',
  'Kabir Sant Sharan, Kathmandu',
  NULL,
  50,
  0,
  date('now', '+7 days'),
  date('now', '+7 days'),
  '18:00',
  '20:00',
  'Asia/Kathmandu',
  1,
  1,
  1,
  date('now', '+7 days'),
  'Spiritual Gathering',
  'satsang,devotion,community,kabir',
  NULL,
  'Kabir Sant Sharan Community',
  'en',
  NULL,
  datetime('now'),
  datetime('now')
);

-- 4. Insert Media
INSERT INTO media (id, title, description, type, category, tags, author, duration, file_size, mime_type, r2_key, r2_bucket, thumbnail_key, streaming_url, download_url, transcription, featured, published, views, downloads, likes, language, uploaded_by, published_at, deleted_at, created_at, updated_at)
VALUES (
  'mgrglwk2lb7rajn0r2q4y8tr',
  'Suno Bhai Sadho - Kabir Bhajan',
  'A beautiful devotional song (bhajan) of Sant Kabir Das. This traditional bhajan speaks of the path to truth and divine realization.',
  'audio',
  'Bhajan',
  'kabir,bhajan,devotional,music',
  'Traditional',
  '4:32',
  5242880,
  'audio/mpeg',
  'sample/kabir-bhajan-suno-bhai-sadho.mp3',
  'kabir-media',
  NULL,
  '/media/sample/kabir-bhajan-suno-bhai-sadho.mp3',
  '/media/sample/kabir-bhajan-suno-bhai-sadho.mp3',
  NULL,
  1,
  1,
  0,
  0,
  0,
  'hi',
  'admin-YWRtaW5A',
  datetime('now'),
  NULL,
  datetime('now'),
  datetime('now')
);