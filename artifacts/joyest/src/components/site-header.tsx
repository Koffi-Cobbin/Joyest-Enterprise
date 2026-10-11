"use client";

import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/bundles", label: "Bundles" },
  { href: "/recipes", label: "Kitchen notes" },
  { href: "/gallery", label: "Journal" },
  { href: "/about", label: "Our approach" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  return (
    <header className="site-header">
      <a href="/" className="brand" aria-label="Joyest Enterprise home">
        <span className="brand-mark" aria-hidden="true">j</span>
        <span className="brand-copy"><strong>joyest</strong><small>ENTERPRISE</small></span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
      <div className="header-actions">
        <a href="/contact" className="header-contact">Let's talk <span aria-hidden="true">↗</span></a>
        <a href="/cart" className="bag-link" aria-label={`Shopping bag, ${itemCount} items`}>
          <ShoppingBag size={19} strokeWidth={1.7} /><span>Bag</span>
          {itemCount > 0 && <b className="bag-count">{itemCount}</b>}
        </a>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && <nav className="mobile-menu" aria-label="Mobile navigation">
        {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>↗</span></a>)}
        <a href="/contact" onClick={() => setOpen(false)}>Get in touch<span>↗</span></a>
      </nav>}
    </header>
  );
}
