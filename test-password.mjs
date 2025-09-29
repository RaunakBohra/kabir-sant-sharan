import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const hash = process.env.ADMIN_PASSWORD_HASH;
console.log('Hash from env:', hash ? `${hash.substring(0,15)}...` : 'NOT FOUND');

const testPassword = 'admin123';
if (hash) {
  const match = await bcrypt.compare(testPassword, hash);
  console.log(`Password "admin123" match: ${match}`);
}
