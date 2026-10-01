export default function UserGuidePage() {
  return (
    <main>
      <section className="content-section">
        <h1 className="content-heading">User Guide</h1>

        <p className="content-copy">
          Skill Based Development is built to help you browse, purchase, and study Brazilian Jiu-Jitsu courses by topic. Use the course pages to review the structure of each instructional, then use your course library to return to any material you have access to.
        </p>

        <p className="content-copy">
          The site is organized around course categories, individual course pages, and a private library for purchased or assigned content.
        </p>
      </section>

      <section className="content-section">
        <h2 className="content-heading">Finding Courses</h2>

        <ul className="content-list">
          <li>Use the Fundamentals page to browse foundational courses.</li>
          <li>Use the Categories page to filter courses by position or skill focus.</li>
          <li>Use course detail pages to review descriptions, pricing, and course structure before opening or purchasing content.</li>
        </ul>
      </section>

      <section className="content-section">
        <h2 className="content-heading">Using Your Library</h2>

        <ul className="content-list">
          <li>Create an account or log in before accessing account-specific course features.</li>
          <li>Purchased or assigned courses appear in your course library.</li>
          <li>Open a course from your library to view chapters, sections, and lessons.</li>
          <li>If a course you expect to see is missing, confirm that you are logged in with the correct account.</li>
        </ul>
      </section>
    </main>
  );
}