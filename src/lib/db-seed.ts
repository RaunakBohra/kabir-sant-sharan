/**
 * Database Seeding System
 * Creates initial admin user and sample data
 * Follows security best practices for credential storage
 */

import { getDatabase } from './db';
import { securityConfig, hashPassword } from './config';
import { createId } from '@paralleldrive/cuid2';
import { eq, sql } from 'drizzle-orm';
import { users, teachings, events, media } from '@/drizzle/schema';

interface SeedResult {
  success: boolean;
  message: string;
  adminUserId?: string;
}

/**
 * Create secure admin user in database
 */
export async function seedAdminUser(env?: any): Promise<SeedResult> {
  try {
    if (!env?.DB) {
      throw new Error('Database not available. Make sure D1 binding is configured.');
    }

    const db = getDatabase(env);

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, securityConfig.auth.adminEmail));

    if (existingAdmin.length > 0) {
      return {
        success: true,
        message: 'Admin user already exists',
        adminUserId: existingAdmin[0].id as string
      };
    }

    // Generate admin user ID
    const adminId = createId();

    // Validate that we have a proper password hash
    if (!securityConfig.auth.adminPasswordHash ||
        securityConfig.auth.adminPasswordHash.length < 10) {
      throw new Error(
        'Invalid admin password hash. Please set ADMIN_PASSWORD_HASH environment variable with a proper bcrypt hash.'
      );
    }

    // Insert admin user
    const result = await db.insert(users).values({
      id: adminId,
      email: securityConfig.auth.adminEmail,
      name: 'System Administrator',
      role: 'admin',
      language: 'en',
      emailVerified: true,
      newsletter: false
    });

    if (result) {
      return {
        success: true,
        message: 'Admin user created successfully',
        adminUserId: adminId
      };
    } else {
      throw new Error('Failed to create admin user');
    }

  } catch (error) {
    console.error('Error seeding admin user:', error);
    return {
      success: false,
      message: `Failed to create admin user: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get admin user from database
 */
export async function getAdminUser(env?: any): Promise<{
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
} | null> {
  try {
    if (!env?.DB) {
      return null;
    }

    const db = getDatabase(env);

    const result = await (db as any).query(
      'SELECT id, email, name, password_hash, role FROM users WHERE email = ? AND role = ?',
      [securityConfig.auth.adminEmail, 'admin']
    );

    if (result.results.length === 0) {
      return null;
    }

    return result.results[0] as any;

  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

/**
 * Update admin password
 */
export async function updateAdminPassword(newPassword: string, env?: any): Promise<SeedResult> {
  try {
    if (!env?.DB) {
      throw new Error('Database not available');
    }

    const db = getDatabase(env);

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the admin user's password
    const result = await (db as any).query(
      'UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ? AND role = ?',
      [hashedPassword, new Date().toISOString(), securityConfig.auth.adminEmail, 'admin']
    );

    if (result.success && result.meta.changes > 0) {
      return {
        success: true,
        message: 'Admin password updated successfully'
      };
    } else {
      throw new Error('Admin user not found or password not updated');
    }

  } catch (error) {
    console.error('Error updating admin password:', error);
    return {
      success: false,
      message: `Failed to update password: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Seed sample spiritual content (teachings, events)
 */
export async function seedSampleContent(env?: any): Promise<SeedResult> {
  try {
    if (!env?.DB) {
      throw new Error('Database not available');
    }

    const db = getDatabase(env);

    // Check if sample content already exists
    const existingTeachings = await (db as any).query('SELECT COUNT(*) as count FROM teachings');
    if ((existingTeachings.results[0] as any).count > 0) {
      return {
        success: true,
        message: 'Sample content already exists'
      };
    }

    // Insert sample teachings
    const teachings = [
      {
        id: createId(),
        title: 'The Path of Divine Love (प्रेम का मार्ग)',
        content: `Sant Kabir teaches us that the path to the divine is through pure love and devotion.

"प्रेम गली अति सांकरी, ता में दो न समाहिं।
जब मैं था तब हरि नहीं, अब हरि हैं मैं नाहिं॥"

The lane of love is very narrow, two cannot walk together. When I existed, God was not there; now God exists, I am not there.`,
        excerpt: 'Discover the essence of divine love through Sant Kabir\'s timeless wisdom.',
        slug: 'path-of-divine-love',
        category: 'Philosophy',
        tags: 'love,devotion,spirituality',
        author: 'Sant Kabir Das',
        published: 1,
        featured: 1,
        language: 'en'
      },
      {
        id: createId(),
        title: 'Unity in Diversity (एकता में अनेकता)',
        content: `Sant Kabir's message transcends all religious boundaries.

"कस्तूरी कुंडल बसे, मृग ढूंढे बन माहि।
ऐसे घट घट राम है, दुनिया देखे नाहि॥"

The musk is in the deer's own navel, but it searches for it in the forest. Similarly, God resides in every heart.`,
        excerpt: 'Understanding the universal message of unity beyond religious boundaries.',
        slug: 'unity-in-diversity',
        category: 'Unity',
        tags: 'unity,religion,peace',
        author: 'Sant Kabir Das',
        published: 1,
        featured: 0,
        language: 'en'
      }
    ];

    for (const teaching of teachings) {
      await (db as any).query(`
        INSERT INTO teachings (
          id, title, content, excerpt, slug, category, tags, author,
          published, featured, language, published_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        teaching.id, teaching.title, teaching.content, teaching.excerpt,
        teaching.slug, teaching.category, teaching.tags, teaching.author,
        teaching.published, teaching.featured, teaching.language,
        new Date().toISOString(), new Date().toISOString(), new Date().toISOString()
      ]);
    }

    return {
      success: true,
      message: 'Sample content seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding sample content:', error);
    return {
      success: false,
      message: `Failed to seed content: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Run all database seeding operations
 */
export async function runDatabaseSeeding(env?: any): Promise<{
  adminUser: SeedResult;
  sampleContent: SeedResult;
}> {
  console.log('🌱 Starting database seeding...');

  const adminUser = await seedAdminUser(env);
  console.log(`Admin user: ${adminUser.message}`);

  const sampleContent = await seedSampleContent(env);
  console.log(`Sample content: ${sampleContent.message}`);

  console.log('✅ Database seeding completed');

  return { adminUser, sampleContent };
}

/**
 * Generate a secure password hash for environment variables
 */
export async function generatePasswordHash(password: string): Promise<string> {
  return hashPassword(password);
}

/**
 * Validate database connection and schema
 */
export async function validateDatabaseSchema(env?: any): Promise<boolean> {
  try {
    if (!env?.DB) {
      throw new Error('Database not available');
    }

    const db = getDatabase(env);

    // Check if required tables exist
    const tables = ['users', 'teachings', 'events', 'sessions'];

    for (const table of tables) {
      try {
        await (db as any).query(`SELECT 1 FROM ${table} LIMIT 1`);
      } catch (error) {
        console.error(`Table ${table} not found or accessible:`, error);
        return false;
      }
    }

    console.log('✅ Database schema validation passed');
    return true;

  } catch (error) {
    console.error('Database schema validation failed:', error);
    return false;
  }
}