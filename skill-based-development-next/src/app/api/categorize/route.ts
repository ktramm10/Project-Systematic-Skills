import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { CourseTag } from "@/generated/prisma/enums";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const filters = searchParams.getAll("tag");
    const validTags = new Set(Object.values(CourseTag));
    const courseTags = filters.filter((filter) => validTags.has(filter as CourseTag));

    if (courseTags.length === 0) {
        return Response.json([]);
    }

    const courses = await prisma.course.findMany({
        where: {
            tags: {
                hasSome: courseTags as CourseTag[],
            },
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            thumbnail: true,
            tags: true,
        },
        take: 24,
    });

    return Response.json(courses);
}