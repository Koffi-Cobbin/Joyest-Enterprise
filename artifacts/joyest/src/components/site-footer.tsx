export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top">
      <div><a href="/" className="footer-brand" data-testid="link-footer-home">joyest<span>.</span></a><p>Everyday care for the rhythms of life in Ghana.</p></div>
      <div className="footer-note"><span className="eyebrow">A little more natural</span><p>Thoughtful food, hair care and spices for the familiar moments that make a day.</p></div>
      <nav aria-label="Footer navigation">
        <a href="/#everyday" data-testid="link-footer-everyday">Explore everyday</a>
        <a href="/#rituals" data-testid="link-footer-rituals">Daily rituals</a>
        <a href="/#our-way" data-testid="link-footer-approach">The Joyest way</a>
        <a href="/#our-promise" data-testid="link-footer-belief">What we believe</a>
      </nav>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Joyest Enterprise</span><span>Made for everyday life in Ghana</span></div>
  </footer>;
}
