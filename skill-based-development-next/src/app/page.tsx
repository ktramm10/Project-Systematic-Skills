import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

async function getCourses() {
  return await prisma.course.findMany();
}

export default async function Home() {
  const courses = await getCourses();
  return (
  <main>
  <section className="hero">
    <video
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
    >
      <source
        src="/content/video/website-placeholder-video.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>

    <div className="hero-overlay">
      <form className="search-bar">
        <input
          type="search"
          placeholder="Search..."
        />

        <button type="submit">
          Search
        </button>
      </form>
    </div>
  </section>

  <section className="hero-2">
    <div className="hero-heading">
      <h1>Beginning Your Journey</h1>
    </div>

    <nav className="hero-nav">
      {courses.map((course) => (
        <div key={course.id} className="content-card">
          <img src={course.thumbnail} alt={course.name} />
          <h2>{course.name}</h2>
          <p>{course.description}</p>
          <p>${(course.priceCents / 100).toFixed(2)}</p>
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </div>
      ))}
    </nav>
  </section>
</main>
);
}
