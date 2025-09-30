import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { createId } from '@paralleldrive/cuid2';
import path from 'path';
import * as schema from './schema';

const { quotes, teachings, events, media } = schema;

async function seedMinimal() {
  console.log('🌱 Starting minimal database seeding...');

  // Connect to local database
  const dbPath = path.join(process.cwd(), 'local.db');
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite, { schema });

  try {
    // 1. Seed Quotes (1 entry)
    console.log('📜 Seeding quotes...');
    await db.insert(quotes).values({
      id: createId(),
      content: 'जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।',
      translation: 'Those who searched, found the truth by diving deep. I, a coward, feared drowning and remained sitting on the shore.',
      author: 'Sant Kabir Das',
      source: 'Kabir Bijak',
      category: 'wisdom',
      tags: 'search,truth,courage,wisdom',
      language: 'hi',
      featured: true,
      active: true,
      displayDate: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0
    });

    // 2. Seed Teachings (1 entry)
    console.log('📚 Seeding teachings...');
    await db.insert(teachings).values({
      id: createId(),
      title: 'The Path of Divine Love (प्रेम का मार्ग)',
      content: `Sant Kabir teaches us that the path to the divine is through pure love and devotion.

True spirituality is not about rituals, but about the sincere love in your heart. When you love the divine with all your being, all barriers dissolve.

प्रेम गली अति सांकरी, ता में दो न समाहिं।
जब मैं था तब हरि नहीं, अब हरि हैं मैं नाहिं॥

The lane of love is very narrow, two cannot fit there together. When I existed, God was not there; now that God exists, I am no more.

This teaching reminds us that true spiritual union requires the dissolution of ego. In the presence of divine love, the individual self must surrender completely.`,
      excerpt: 'Sant Kabir teaches that the path to the divine is through pure love and devotion, requiring the complete dissolution of ego.',
      slug: 'the-path-of-divine-love',
      category: 'Philosophy',
      tags: 'love,devotion,ego,spirituality',
      author: 'Sant Kabir Das',
      published: true,
      featured: true,
      views: 0,
      likes: 0,
      language: 'en',
      coverImage: null,
      readingTime: 3,
      publishedAt: new Date().toISOString()
    });

    // 3. Seed Events (1 entry)
    console.log('🎉 Seeding events...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const endTime = new Date(tomorrow);
    endTime.setHours(endTime.getHours() + 2);

    await db.insert(events).values({
      id: createId(),
      title: 'Weekly Satsang - Kabir Teachings',
      description: 'Join us for a weekly spiritual gathering where we explore the profound teachings of Sant Kabir Das. Through devotional songs, discussions, and meditation, we come together as a community to deepen our understanding of his timeless wisdom.',
      slug: 'weekly-satsang-kabir-teachings',
      type: 'satsang',
      location: 'Kabir Sant Sharan, Kathmandu',
      virtualLink: null,
      maxAttendees: 50,
      currentAttendees: 0,
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '20:00',
      timezone: 'Asia/Kathmandu',
      featured: true,
      published: true,
      registrationRequired: true,
      registrationDeadline: tomorrow.toISOString().split('T')[0],
      category: 'Spiritual Gathering',
      tags: 'satsang,devotion,community,kabir',
      coverImage: null,
      organizer: 'Kabir Sant Sharan Community',
      language: 'en'
    });

    // 4. Seed Media (1 entry)
    console.log('🎵 Seeding media...');
    await db.insert(media).values({
      id: createId(),
      title: 'Suno Bhai Sadho - Kabir Bhajan',
      description: 'A beautiful devotional song (bhajan) of Sant Kabir Das. This traditional bhajan speaks of the path to truth and divine realization.',
      type: 'audio',
      category: 'Bhajan',
      tags: 'kabir,bhajan,devotional,music',
      author: 'Traditional',
      duration: '4:32',
      fileSize: 5242880, // 5MB
      mimeType: 'audio/mpeg',
      r2Key: 'sample/kabir-bhajan-suno-bhai-sadho.mp3',
      r2Bucket: 'kabir-media',
      thumbnailKey: null,
      streamingUrl: '/media/sample/kabir-bhajan-suno-bhai-sadho.mp3',
      downloadUrl: '/media/sample/kabir-bhajan-suno-bhai-sadho.mp3',
      transcription: null,
      featured: true,
      published: true,
      views: 0,
      downloads: 0,
      likes: 0,
      language: 'hi',
      uploadedBy: 'admin-YWRtaW5A',
      publishedAt: new Date().toISOString()
    });

    console.log('✅ Minimal seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('  - 1 quote inserted');
    console.log('  - 1 teaching inserted');
    console.log('  - 1 event inserted');
    console.log('  - 1 media item inserted');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run seed
seedMinimal()
  .then(() => {
    console.log('🎉 Database seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });