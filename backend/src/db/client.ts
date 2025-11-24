import 'dotenv/config'
import envConfig from "@/env.js" // Add .js extension for ESM
import { PrismaClient } from "../generated/prisma/client.js" // Update import path
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create the adapter
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL!
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // Add the adapter
    log:
      envConfig.NODE_ENV === "development"
        ? [] // ["query", "error", "warn"]
        : ["error"], // only log errors in prod
  })

if (envConfig.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}