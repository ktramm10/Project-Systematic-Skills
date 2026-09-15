import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaGenerated from "../src/generated/prisma/client";

const { PrismaClient } =
  (PrismaGenerated as unknown as { default?: typeof PrismaGenerated }).default ??
  PrismaGenerated;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const courses = [
  {
    id: 1,
    name: "Beating the Pin: Side Control",
    priceCents: 2999,
    description:
      "Learn the fundamentals of side control in Brazilian Jiu-Jitsu, including escapes, submissions, and transitions.",
    thumbnail: "/content/images/courses/beating-the-pin-side-control.jfif",
  },
  {
    id: 2,
    name: "Fundamentals of Closed Guard",
    priceCents: 2499,
    description:
      "Master the basics of closed guard in Brazilian Jiu-Jitsu, focusing on control, sweeps, and submissions.",
    thumbnail: "/content/images/courses/fundamentals-of-closed-guard.jfif",
  },
];

async function main() {
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: course,
      create: course,
    });
  }

  console.log(`Seeded ${courses.length} courses.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });