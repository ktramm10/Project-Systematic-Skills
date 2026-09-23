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


async function main() {
  await prisma.course.create({
    data: {
        name: "Fundamentals of Half Guard",
        slug: "half-guard-fundamentals",
        priceCents: 4999,
        description: "Learn the fundamental principles of an effective half-guard in a simple to implement system addresses the fundamental attack structures and defensive principles required to have success against people of all ages and skill levels. We begin with an in-depth analysis and breakdown of the most troublesome attribute of the half guard, its effectiveness as both a passing position and a guard position. We will learn how to turn the half guard in our favor defeating troublesome top pins and gaining effective grips to change the momentum of the fight and attack with time tested systems that work from the beginners class to the world stage.",
        thumbnail: "",

        chapters: {
            create: [
                {
                    title: "Introduction to Half Guard",
                    slug: "introduction-to-half-guard",
                    position: 1,

                    sections: {
                        create: [
                            {
                                title: "Position Overview",
                                slug: "position-overview",
                                position: 1,

                                lessons: {
                                    create: [
                                        {
                                            title: "Half Guard Perspective 1: Passing Dominance",
                                            slug: "half-guard-perspective-1",
                                            description:
                                              "Learn the fundamental principles of the half guard.",
                                            videoUrl:
                                              "/content/video/website-placeholder-video.mp4",
                                            duration: 0,
                                            position: 1,
                                        },
                                        {
                                            title: "Half Guard Perspective 2: Ingenious Guard",
                                            slug: "half-guard-perspective-2",
                                            description:
                                              "Learn how to create the angle for the armbar.",
                                            videoUrl:
                                              "/content/video/website-placeholder-video.mp4",
                                            duration: 0,
                                            position: 2,
                                        },
                                        {
                                            title: "The First Skill You Must Develop In The Half Guard: Recovering From Disaster",
                                            slug: "recovering-from-disaster",
                                            description:
                                              "Learn how to recover from a bad position in the half guard.",
                                            videoUrl:
                                              "/content/video/website-placeholder-video.mp4",
                                            duration: 0,
                                            position: 3,
                                        },
                                        {
                                            title: "3 Paths to Effective Offense in the Half Guard",
                                            slug: "3-paths-to-effective-offense-in-the-half-guard",
                                            description:
                                              "Learn the three main approaches to launching effective attacks from the half guard.",
                                            videoUrl:
                                              "/content/video/website-placeholder-video.mp4",
                                            duration: 0,
                                            position: 4,
                                        },
                                        {
                                            title: "Should You Play the Half Guard?",
                                            slug: "should-you-play-the-half-guard",
                                            description:
                                              "Explore the pros and cons of playing the half guard.",
                                            videoUrl:
                                              "/content/video/website-placeholder-video.mp4",
                                            duration: 0,
                                            position: 5,
                                        }
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        },
    },
});
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