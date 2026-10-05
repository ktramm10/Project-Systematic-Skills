import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

const COURSE_IMAGE_FALLBACK = "/content/images/courses/fundamentals-of-closed-guard.jfif";

async function getCourses() {
    return await prisma.course.findMany();
}

export default async function Fundamentals() {
    const courses = await getCourses();
    return (
        <main>
            <section className="content-section">
                <h1 className="content-heading">Fundamentals Courses</h1>
                <div className="content-flex-container">
                    {courses.map((course) => (
                        <div key={course.id} className="content-card">
                            <Image src={course.thumbnail || COURSE_IMAGE_FALLBACK} alt={course.name} width={320} height={180} />
                            <h2>{course.name}</h2>
                            <p>{course.description}</p>
                            <p>${(course.priceCents / 100).toFixed(2)}</p>
                            <Link href={`/courses/${course.slug}`}>View Course</Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>


    );
}