import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // Load DATABASE_URL etc. before any test imports the app/Prisma.
    setupFiles: ['dotenv/config'],
    include: ['src/**/*.test.ts'],
  },
})
