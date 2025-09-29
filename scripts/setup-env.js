#!/usr/bin/env node

/**
 * Environment Setup Script
 * Generates secure environment variables and creates .env.local
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64url');
}

async function generatePasswordHash(password) {
  return bcrypt.hash(password, 12);
}

async function setupEnvironment() {
  console.log('🔧 Setting up Kabir Sant Sharan environment...\n');

  // Generate secure secrets
  const jwtSecret = generateSecureSecret(32);
  const jwtRefreshSecret = generateSecureSecret(32);

  // Default admin credentials
  const adminEmail = 'admin@kabirsantsharan.com';
  const adminPassword = 'admin123'; // Change this in production!
  const adminPasswordHash = await generatePasswordHash(adminPassword);

  const envContent = `# Kabir Sant Sharan - Environment Configuration
# Generated on ${new Date().toISOString()}
# IMPORTANT: Change default passwords before production deployment!

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Admin Configuration
ADMIN_EMAIL=${adminEmail}
ADMIN_PASSWORD_HASH=${adminPasswordHash}

# Rate Limiting Configuration
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_AUTH_WINDOW=60000
RATE_LIMIT_API_MAX=100
RATE_LIMIT_API_WINDOW=900000

# Security Configuration
CORS_ORIGIN=http://localhost:5002,https://kabirsantsharan.com
BCRYPT_SALT_ROUNDS=12

# Monitoring & Logging
LOG_LEVEL=info

# Environment
NODE_ENV=development
ENVIRONMENT=development

# Development Database (for local testing)
# DATABASE_URL=your-d1-database-url
# DATABASE_AUTH_TOKEN=your-d1-auth-token

# Optional: Monitoring Services
# SENTRY_DSN=your-sentry-dsn-for-error-tracking
`;

  const envPath = path.join(process.cwd(), '.env.local');

  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Creating backup...');
    fs.copyFileSync(envPath, `${envPath}.backup.${Date.now()}`);
  }

  fs.writeFileSync(envPath, envContent);

  console.log('✅ Environment setup completed!');
  console.log('\n📋 Configuration Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 Admin Email: ${adminEmail}`);
  console.log(`🔑 Admin Password: ${adminPassword}`);
  console.log(`🔐 JWT Secret: ${jwtSecret.substring(0, 8)}...`);
  console.log(`🔄 Refresh Secret: ${jwtRefreshSecret.substring(0, 8)}...`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n🚨 SECURITY WARNINGS:');
  console.log('1. Change the default admin password before production!');
  console.log('2. Never commit .env.local to version control');
  console.log('3. Use strong passwords in production');
  console.log('4. Set up proper monitoring and logging');

  console.log('\n🚀 Next Steps:');
  console.log('1. npm run dev (start development server)');
  console.log('2. Visit http://localhost:5002/admin');
  console.log('3. Login with the credentials above');
  console.log('4. Update admin password in Settings');

  console.log('\n📚 Documentation:');
  console.log('• Security Guide: /docs/security.md');
  console.log('• Deployment Guide: /docs/deployment.md');
  console.log('• API Documentation: http://localhost:5002/api-docs');
}

if (require.main === module) {
  setupEnvironment().catch(console.error);
}

module.exports = { setupEnvironment, generateSecureSecret, generatePasswordHash };