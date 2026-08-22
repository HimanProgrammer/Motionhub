import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="brand" href="/"><span className="logo-dot" /> MotionHub</Link>
        <div className="footer-links">
          <Link href="/#gallery">Prompts</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="#">Contact</Link>
        </div>
        <span>© 2026 MotionHub</span>
      </div>
    </footer>
  );
}
