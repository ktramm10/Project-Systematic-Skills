import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim();
    const scope = searchParams.get("scope") === "owned" ? "owned" : "all";

    if (!query) {
        return Response.json([]);
    }

    const courseSearchFilter = {
        OR: [
            {
                name: {
                    contains: query,
                    mode: "insensitive" as const,
                },
            },
            {
                description: {
                    contains: query,
                    mode: "insensitive" as const,
                },
            },
        ],
    };

    if (scope === "owned") {
        const session = await getSession();

        if (!session?.userId) {
            return Response.json(
                { error: "You must be logged in to search your courses." },
                { status: 401 },
            );
        }

        const courses = await prisma.course.findMany({
            where: {
                AND: [
                    courseSearchFilter,
                    {
                        enrollments: {
                            some: {
                                userId: Number(session.userId),
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                thumbnail: true,
            },
            take: 10,
        });

        return Response.json(courses);
    }

    const courses = await prisma.course.findMany({
        where: courseSearchFilter,
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            thumbnail: true,
        },
        take: 10,
    });

    return Response.json(courses);
}