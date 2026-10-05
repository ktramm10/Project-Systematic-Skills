import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import SearchBar from "../components/SearchBar";
import {verifySession} from "@/lib/auth";

const COURSE_IMAGE_FALLBACK = "/content/images/courses/fundamentals-of-closed-guard.jfif";

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

                </div>

                <div className="library-stat" aria-label={`${courseCount} enrolled courses`}>
                    <span>{courseCount}</span>
                    <p>{courseCount === 1 ? "Course Ready" : "Courses Ready"}</p>
                </div>
                <div className="library-search">
                    <SearchBar scope="owned" resultHrefPrefix="/course-library/viewer" />
                </div>
                {courseCount > 0 ? (
                    <div className="library-course-container">
                        {courses.map((course) => (
                            <article key={course.id} className="content-card library-course-card">
                                <Image
                                    src={course.thumbnail || COURSE_IMAGE_FALLBACK}
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