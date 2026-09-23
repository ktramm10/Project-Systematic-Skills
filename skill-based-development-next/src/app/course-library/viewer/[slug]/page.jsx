import prisma from "@/lib/prisma";
import CoursePlayer from "@/app/components/CoursePlayer";
import {notFound} from "next/navigation";
import {verifySession} from "@/lib/auth";

export default async function CourseLearningPage({ params }) {
    const {slug} = await params;
    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
                include: {
                    sections: {
                        orderBy: {
                            position: "asc",
                        },
                        include: {
                            lessons: {
                                orderBy: {
                                    position: "asc",
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    const session = await verifySession();
    const isValidUser = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.userId,
                courseId: course.id,
            },
        },
    });

    if (!isValidUser) {
        notFound();
    }

    return <CoursePlayer course={course} />;
}