import Image from "next/image";

export default function Home() {
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
      <div className="rec-course">
        <a href="#">
          <Image
            src="/content/images/thumbnail-placeholder-image.png"
            alt="thumbnail"
            width={320}
            height={180}
            priority
          />
        </a>
      </div>

      <div className="rec-course">
        <a href="#">
          <Image
            src="/content/images/thumbnail-placeholder-image.png"
            alt="thumbnail"
            width={320}
            height={180}
          />
        </a>
      </div>

      <div className="rec-course">
        <a href="#">
          <Image
            src="/content/images/thumbnail-placeholder-image.png"
            alt="thumbnail"
            width={320}
            height={180}
          />
        </a>
      </div>
    </nav>
  </section>
</main>
);
}
