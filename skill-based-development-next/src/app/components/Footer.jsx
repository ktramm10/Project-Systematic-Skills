import Link from "next/link";

export default function Footer() {
return (
<footer className="site-footer">
  <div className="footer-content">
    <div className="footer-section">
      <h3>Skill Based Development</h3>
      <p>
        Skill Based Development is a site intended to help BJJ practitioners
        develop the skills required to be effective either in competition or
        during training.
      </p>
    </div>

    <div className="footer-section">
      <h4>Links</h4>
      <Link href="/">Home</Link>
      <Link href="/goals">Goals</Link>
      <Link href="/how-to">How To</Link>
      <Link href="/lineage">Lineage</Link>
    </div>

    <div className="footer-section">
      <h4>Connect</h4>
      <a href="https://github.com/ktramm10" rel="noreferrer" target="_blank">GitHub</a>
      <a href="https://www.linkedin.com/in/keith-tramm-a10946254/" rel="noreferrer" target="_blank">
        LinkedIn
      </a>
    </div>
  </div>

  <div className="footer-bottom">
    <p>&copy; 2026 Skill Based Development. All rights reserved.</p>
  </div>
</footer>
);
}