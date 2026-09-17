import Link from "next/link";
import prisma from "@/lib/prisma";

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
                            <img src={course.thumbnail} alt={course.name} />
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