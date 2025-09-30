import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || 'cf50986b-cc78-4c0c-b6bd-268e6b8c44c5',
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || 'cf50986b-cc78-4c0c-b6bd-268e6b8c44c5',
    token: process.env.CLOUDFLARE_API_TOKEN || ''
  }
})