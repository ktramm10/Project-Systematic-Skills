import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaGenerated from "../generated/prisma/client";

const { PrismaClient } =
  (PrismaGenerated as unknown as { default?: typeof PrismaGenerated }).default ??
  PrismaGenerated;

const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClient>;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;