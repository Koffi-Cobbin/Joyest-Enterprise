export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top">
      <div><a href="/" className="footer-brand">joyest<span>.</span></a><p>Everyday goodness, gathered with care.</p></div>
      <div className="footer-note"><span className="eyebrow">A little more natural</span><p>Good food, thoughtful care, and spices that bring a kitchen to life.</p></div>
      <nav aria-label="Footer navigation">
        <a href="/shop">Shop the collection</a><a href="/recipes">Recipes</a><a href="/about">About Joyest</a><a href="/contact">Contact</a>
      </nav>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Joyest Enterprise</span><span>Made for everyday life in Ghana</span></div>
  </footer>;
}
