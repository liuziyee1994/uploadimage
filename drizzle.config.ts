import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://postgres:12345@localhost:5432/uploadimage?sslmode=disable"
  },
  verbose: true,
  strict: true,
})