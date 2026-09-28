import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import * as PrismaGenerated from "../src/generated/prisma/client";
import { CourseTag } from "../src/generated/prisma/enums";

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
  await prisma.course.upsert({
    where: { slug: "half-guard-fundamentals" },
    update: {
        name: "Fundamentals of Half Guard",
        priceCents: 4999,
        description: "Learn the fundamental principles of an effective half-guard in a simple to implement system addresses the fundamental attack structures and defensive principles required to have success against people of all ages and skill levels. We begin with an in-depth analysis and breakdown of the most troublesome attribute of the half guard, its effectiveness as both a passing position and a guard position. We will learn how to turn the half guard in our favor defeating troublesome top pins and gaining effective grips to change the momentum of the fight and attack with time tested systems that work from the beginners class to the world stage.",
        thumbnail: "",
        tags: { set: [CourseTag.FUNDAMENTALS, CourseTag.HALF_GUARD] },
    },
    create: {
        name: "Fundamentals of Half Guard",
        slug: "half-guard-fundamentals",
        priceCents: 4999,
        description: "Learn the fundamental principles of an effective half-guard in a simple to implement system addresses the fundamental attack structures and defensive principles required to have success against people of all ages and skill levels. We begin with an in-depth analysis and breakdown of the most troublesome attribute of the half guard, its effectiveness as both a passing position and a guard position. We will learn how to turn the half guard in our favor defeating troublesome top pins and gaining effective grips to change the momentum of the fight and attack with time tested systems that work from the beginners class to the world stage.",
        thumbnail: "",
        tags: [CourseTag.FUNDAMENTALS, CourseTag.HALF_GUARD],

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
  await prisma.course.upsert({
    where: { slug: "core-body-movements-and-solo-drills" },
    update: {
        name: "Fundamentals of Jiu Jitsu: Core Body Movements and Solo Drills",
        priceCents: 2999,
        description: "Learn about the core body movements that underly all of the techniques within the sport. Mastery of the core-body movements is the first step on your journey to optimizing your learning proccess and unlocking your full potential.",
        thumbnail: "",
        tags: { set: [CourseTag.FUNDAMENTALS, CourseTag.SOLO_DRILLS] },
    },
    create: {
        name: "Fundamentals of Jiu Jitsu: Core Body Movements and Solo Drills",
        slug: "core-body-movements-and-solo-drills",
        priceCents: 2999,
        description: "Learn about the core body movements that underly all of the techniques within the sport. Mastery of the core-body movements is the first step on your journey to optimizing your learning proccess and unlocking your full potential.",
        thumbnail: "",
        tags: [CourseTag.FUNDAMENTALS, CourseTag.SOLO_DRILLS],

        chapters: {
            create: [
                {
                    title: "Introduction",
                    slug: "introduction",
                    position: 1,

                    sections: {
                        create: [
                            {
                                title: "Beginning Your Journey",
                                slug: "beginning-your-journey",
                                position: 1,

                                lessons: {
                                    create: [
                                        {
                                            title: "Who Am I?",
                                            slug: "who-am-i",
                                            description:
                                              "",
                                            videoUrl:
                                              "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Intro/Core-Body-Movements-Intro-WhoAmI.mp4",
                                            duration: 0,
                                            position: 1,
                                        },
                                        {
                                            title: "My Goals For This Instructional Video",
                                            slug: "my-goals-for-this-video",
                                            description:
                                              "",
                                            videoUrl:
                                              "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Intro/Core-Body-Movements-Goals-Of-The-Series.mp4",
                                            duration: 0,
                                            position: 2,
                                        },
                                        {
                                            title: "How I Want You To Utilize This Material",
                                            slug: "how-i-want-you-to-utilize-this-material",
                                            description:
                                              "",
                                            videoUrl:
                                              "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Intro/Core-Body-Movements-How-To-Use-The-Material.mp4",
                                            duration: 0,
                                            position: 3,
                                        },
                                        
                                    ],
                                },
                            },
                            
                        ],
                    },
                },
                {
                    title: "The Essential Movements For Beginners",
                    slug: "essential-movements-for-beginners",
                    position: 2,

                    sections: {
                      create: [
                      {
                      title: "Bridging and Shrimping",
                      slug: "bridging and shrimping",
                      position: 1,
                      lessons: {
                        create: [
                          {
                            title: "Sliding Shrimp",
                            slug: "sliding-shrimp",
                            description: "",
                            videoUrl: "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Bridging and Shrimping/Core-Body-Movements-Sliding-Shrimp.mp4",
                            duration: 0,
                            position: 1,
                          },
                          {
                            title: "Bridging For Jiu Jitsu",
                            slug: "bridging-for-jiu-jitsu",
                            description: "",
                            videoUrl: "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Bridging and Shrimping/Core-Body-Movements-Bridging.mp4",
                            duration: 0,
                            position: 3,
                          },
                          {
                            title: "Reverse Shrimp / Forward Shrimp",
                            slug: "reverse-shrimp",
                            description: "",
                            videoUrl: "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Bridging and Shrimping/Core-Body-Movements-Reverse-Shrimp.mp4",
                            duration: 0,
                            position: 2,
                          },
                          {
                            title: "The Power Shrimp",
                            slug: "power-shrimp",
                            description: "",
                            videoUrl: "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Bridging and Shrimping/Core-Body-Movements-Power-Shrimp.mp4",
                            duration: 0,
                            position: 4,
                          },
                        ],
                      },
                      },
                      {
                      title: "Shoulder Rolls",
                      slug: "shoulder-rolls",
                      position: 2,
                      lessons: {
                        create: [
                          {
                            title: "The Forwards Roll",
                            slug: "forwards-roll",
                            description: "",
                            videoUrl: "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Shoulder Rolls/Core-Body-Movements-Forwards-Roll.mp4",
                            duration: 0,
                            position: 1,
                          },
                          {
                            title: "Retention Forwards Roll",
                            slug: "retention-forwards-roll",
                            description: "",
                            videoUrl: "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Shoulder Rolls/Core-Body-Movements-Retention-Forwards-Roll.mp4",
                            duration: 0,
                            position: 2,
                          },
                          {
                            title: "The Backwards Roll",
                            slug: "backwards-roll",
                            description: "",
                            videoUrl: "/content/video/course-content/Fundamentals Of Jiu Jitsu - Core Body Movements and Solo Drills/Shoulder Rolls/Core-Body-Movements-Backwards-Roll.mp4",
                            duration: 0,
                            position: 3,
                          },
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