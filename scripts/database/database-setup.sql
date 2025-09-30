-- Kabir Sant Sharan Database Setup
-- Copy and paste these commands into Supabase SQL Editor

-- 1. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (true);

-- Policy for authenticated users to insert/update
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  registration_required BOOLEAN DEFAULT false,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  featured_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage events" ON events
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Sant Kabir Das',
  language TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quotes are viewable by everyone" ON quotes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage quotes" ON quotes
  FOR ALL USING (auth.role() = 'authenticated');

-- 4. Media Content Table
CREATE TABLE IF NOT EXISTS media_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- 'audio', 'video', 'document'
  duration INTEGER, -- in seconds
  category TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured_image TEXT
);

ALTER TABLE media_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media content is viewable by everyone" ON media_content
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage media" ON media_content
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{
    "language": "en",
    "emailNotifications": true,
    "eventReminders": true,
    "newsletter": true
  }'::jsonb
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Insert Sample Data
INSERT INTO quotes (text, author, language, category) VALUES
('जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।', 'Sant Kabir Das', 'ne', 'wisdom'),
('दो कोस प्यार के, ना मिल तो क्या गम? मन दीपक जलाइए, यदि सुमिरन केर नाम।', 'Sant Kabir Das', 'ne', 'devotion'),
('Truth is one, the wise call it by many names.', 'Sant Kabir Das', 'en', 'truth'),
('The path of love is not about finding the perfect person, but about finding the divine in every soul.', 'Sant Kabir Das', 'en', 'wisdom'),
('माला फेरत जुग भया, फिरा न मन का फेर। कर का मन का डार दे, मन का मन का फेर।', 'Sant Kabir Das', 'ne', 'meditation'),
('Love is the bridge between two hearts, and the divine is the river that flows beneath.', 'Sant Kabir Das', 'en', 'devotion');

-- Add some sample events
INSERT INTO events (title, description, date, location, type, slug) VALUES
('Weekly Satsang', 'Join us for our weekly gathering of spiritual seekers. We will sing bhajans, share teachings, and meditate together.', '2024-10-06 18:00:00+00', 'Main Hall, Kabir Ashram', 'satsang', 'weekly-satsang-oct-6'),
('Kabir Jayanti Celebration', 'Celebrate the birth anniversary of Sant Kabir Das with special programs, devotional singing, and community feast.', '2024-10-24 10:00:00+00', 'Kabir Ashram Grounds', 'festival', 'kabir-jayanti-2024'),
('Meditation Workshop', 'Learn the fundamentals of meditation and inner contemplation as taught in Kabir''s philosophy.', '2024-11-10 14:00:00+00', 'Meditation Hall', 'workshop', 'meditation-workshop-nov-10');

-- Create storage bucket for media files (run this separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies for media bucket
-- CREATE POLICY "Public read access for media" ON storage.objects
--   FOR SELECT USING (bucket_id = 'media');

-- CREATE POLICY "Authenticated users can upload media" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);
CREATE INDEX IF NOT EXISTS quotes_language_idx ON quotes(language);
CREATE INDEX IF NOT EXISTS quotes_category_idx ON quotes(category);