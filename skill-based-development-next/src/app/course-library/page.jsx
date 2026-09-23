import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {verifySession} from "@/lib/auth";

export default async function CourseLibraryPage() {
    function truncateText(text, maxLength) {
        if (!text) return "";
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
    const session = await verifySession();
    const courses = await prisma.course.findMany({
        where: {
            enrollments: {
                some: {
                    userId: session.userId,
                },
            },
        },
    });
    const courseCount = courses.length;

    return (
        <main className="library-page">
            <section className="library-shell">
                <div className="library-heading-group">
                    <h1 className="library-heading">Your Course Library</h1>
                    <p className="library-intro">
                        Pick up where you left off and keep your training organized in one place.
                    </p>
                </div>

                <div className="library-stat" aria-label={`${courseCount} enrolled courses`}>
                    <span>{courseCount}</span>
                    <p>{courseCount === 1 ? "Course Ready" : "Courses Ready"}</p>
                </div>

                {courseCount > 0 ? (
                    <div className="library-course-container">
                        {courses.map((course) => (
                            <article key={course.id} className="content-card library-course-card">
                                <Image
                                    src={course.thumbnail}
                                    alt={course.name}
                                    width={640}
                                    height={360}
                                />
                                <div className="library-card-body">
                                    <p className="library-card-label">Course</p>
                                    <h2>{course.name}</h2>
                                    {course.description && <p>{truncateText(course.description, 150)}</p>}
                                </div>
                                <Link href={`/course-library/viewer/${course.slug}`}>Enter Course</Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="library-empty-state">
                        <h2>No courses yet</h2>
                        <p>
                            Courses you purchase will appear here once you have purchased them.
                        </p>
                        <Link href="/">Browse courses</Link>
                    </div>
                )}
            </section>
        </main>
    );
}