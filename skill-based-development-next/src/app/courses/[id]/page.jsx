import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CoursePage({ params }) {
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    notFound();
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        include: {
          sections: {
            include: {
              lessons: true,
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
      </section>
    </main>
  );
}