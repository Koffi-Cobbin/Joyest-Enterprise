import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top">
      <div><Link href="/" className="footer-brand">joyest<span>.</span></Link><p>Everyday goodness, gathered with care.</p></div>
      <div className="footer-note"><span className="eyebrow">A little more natural</span><p>Good food, thoughtful care, and spices that bring a kitchen to life.</p></div>
      <nav aria-label="Footer navigation">
        <Link href="/shop">Shop the collection</Link><Link href="/recipes">Recipes</Link><Link href="/about">About Joyest</Link><Link href="/contact">Contact</Link>
      </nav>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Joyest Enterprise</span><span>Made for everyday life in Ghana</span></div>
  </footer>;
}
