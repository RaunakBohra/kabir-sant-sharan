# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/in with GitHub
3. Click "New Project"
4. Choose organization and set:
   - **Name**: `kabir-sant-sharan`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users
5. Wait for project creation (2-3 minutes)

## 2. Get Project Credentials

1. Go to Settings → API
2. Copy these values to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 3. Database Schema Setup

Run these SQL commands in Supabase SQL Editor:

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
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
```

### Events Table
```sql
CREATE TABLE events (
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
```

### Quotes Table
```sql
CREATE TABLE quotes (
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
```

### Media Content Table
```sql
CREATE TABLE media_content (
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
```

### Users Table Extension
```sql
CREATE TABLE user_profiles (
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
```

## 4. Sample Data

### Insert Sample Quotes
```sql
INSERT INTO quotes (text, author, language, category) VALUES
('जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।', 'Sant Kabir Das', 'ne', 'wisdom'),
('दो कोस प्यार के, ना मिल तो क्या गम? मन दीपक जलाइए, यदि सुमिरन केर नाम।', 'Sant Kabir Das', 'ne', 'devotion'),
('Truth is one, the wise call it by many names.', 'Sant Kabir Das', 'en', 'truth'),
('The path of love is not about finding the perfect person, but about finding the divine in every soul.', 'Sant Kabir Das', 'en', 'wisdom');
```

## 5. Authentication Setup

1. Go to Authentication → Settings
2. Enable email authentication
3. Configure email templates
4. Set up redirect URLs:
   - Site URL: `http://localhost:5000`
   - Additional URLs: `https://your-domain.com`

## 6. Storage Setup

1. Go to Storage → Settings
2. Create bucket named `media`
3. Set up policies for public read access:

```sql
-- Allow public access to media files
CREATE POLICY "Public read access for media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
```

## 7. API Testing

Test your setup with this simple API call:

```javascript
import { supabase } from '@/lib/supabase'

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .limit(1)

  console.log('Connection test:', { data, error })
}
```

## Free Tier Limits

- **Database**: 500 MB storage
- **Auth**: 50,000 monthly active users
- **Storage**: 1 GB
- **Bandwidth**: 2 GB
- **API requests**: 50,000 per month

## Cost Management

- Monitor usage in Supabase dashboard
- Set up billing alerts
- Optimize queries with proper indexing
- Use CDN for static assets

## Security Best Practices

1. Enable Row Level Security (RLS) on all tables
2. Use environment variables for secrets
3. Implement proper authentication flows
4. Regular security audits
5. Monitor unusual activity