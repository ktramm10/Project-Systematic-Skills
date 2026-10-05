import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import SearchBar from "./components/SearchBar";

const COURSE_IMAGE_FALLBACK = "/content/images/courses/fundamentals-of-closed-guard.jfif";

async function getCourses() {
  return await prisma.course.findMany();
}

export default async function Home() {
  const courses = await getCourses();
  const courseCount = courses.length;

  return (
    <main>
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/content/video/website-placeholder-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-overlay">
          <div className="hero-content">

            <h1 className="hero-title">An optimized way to build a effective game.</h1>
            <p className="hero-copy">
              Study focused course paths, clear positional goals, and practical lessons designed
              to make every round more intentional.
            </p>
            <div className="hero-actions">
              <Link className="hero-primary-link" href="#courses">Browse courses</Link>
              <Link className="hero-secondary-link" href="/user-guide">How it works</Link>
            </div>
          </div>

          <div className="hero-panel">
            <p className="hero-panel-label">Find your next study focus</p>
            <SearchBar />
            <div className="hero-metrics" aria-label="Site highlights">
              <span>{courseCount || "New"}<small>Courses</small></span>
              <span>Goal-led<small>Training</small></span>
              <span>Anytime<small>Access</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-2" id="courses">
        <div className="hero-heading">
          <h2>Beginning Your Journey</h2>
          <p>Structured instruction for building reliable skills from every position.</p>
        </div>

        <nav className="hero-nav" aria-label="Featured courses">
          {courses.map((course) => (
            <article key={course.id} className="content-card">
              <Image src={course.thumbnail || COURSE_IMAGE_FALLBACK} alt={course.name} width={640} height={360} />
              <h2>{course.name}</h2>
              <p>{course.description}</p>
              <p className="content-price">${(course.priceCents / 100).toFixed(2)}</p>
              <Link href={`/courses/${course.slug}`}>View Course</Link>
            </article>
          ))}
        </nav>
      </section>
    </main>
  );
}
