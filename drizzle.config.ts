import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './functions/src/drizzle/schema.ts',
  out: './functions/src/drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '7e506c3c49803094e72145796c0f8598',
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || '7d3419c9-e12a-4fda-a712-fd79e0334182',
    token: process.env.CLOUDFLARE_API_TOKEN || ''
  }
})