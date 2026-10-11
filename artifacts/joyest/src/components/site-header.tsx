"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#everyday", label: "Everyday", id: "everyday" },
  { href: "/#our-way", label: "Our approach", id: "approach" },
  { href: "/#rituals", label: "Daily rituals", id: "rituals" },
  { href: "/#our-promise", label: "What we believe", id: "belief" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a href="/" className="brand" aria-label="Joyest Enterprise home" data-testid="link-brand-home">
        <span className="brand-mark" aria-hidden="true">j</span>
        <span className="brand-copy"><strong>joyest</strong><small>ENTERPRISE</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => <a key={link.id} href={link.href} data-testid={`link-desktop-${link.id}`}>{link.label}</a>)}
      </nav>
      <div className="header-actions">
        <a href="/#our-promise" className="header-contact" data-testid="link-header-belief">Our belief <span aria-hidden="true">↗</span></a>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={open ? "mobile-navigation" : undefined} aria-label={open ? "Close menu" : "Open menu"} data-testid="button-toggle-navigation">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
        {links.map((link) => <a key={link.id} href={link.href} onClick={() => setOpen(false)} data-testid={`link-mobile-${link.id}`}>{link.label}<span>↗</span></a>)}
        <a href="/#our-promise" onClick={() => setOpen(false)} data-testid="link-mobile-belief">What we believe<span>↗</span></a>
      </nav>}
    </header>
  );
}
