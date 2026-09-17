import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CourseOverview from "@/app/components/CourseOverview";
import PurchaseButton from "@/app/components/PurchaseButton";

export default async function CoursePage({ params }) {
    const { slug } = await params;

    const course = await prisma.course.findUnique({
        where: {
            slug,
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

    return (
        <main>
            <section className="content-section">
                <h1 className="content-heading">{course.name}</h1>
                <p className="content-copy">{course.description}</p>
                <h2 className="content-subheading">Course Overview</h2>
                <CourseOverview course={course} />
                <p className="content-price">Price: ${(course.priceCents / 100).toFixed(2)}</p>
                <PurchaseButton course={course} />
            </section>
        </main>
    );
}