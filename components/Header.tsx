"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CartButton from "@/components/CartButton";
import { business } from "@/data/business";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const isActiveLink = (pathname: string, href: string): boolean =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const desktopLinkClasses = (active: boolean): string =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    active ? "text-primary" : "text-foreground hover:text-primary"
  }`;

const mobileLinkClasses = (active: boolean): string =>
  `block rounded-md px-3 py-3 text-base font-medium transition-colors ${
    active ? "bg-background text-primary" : "text-foreground hover:bg-background"
  }`;

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset; switch to next/image when optimizing */}
          <img
            src="/joyest-emblem.webp"
            alt=""
            className="h-10 w-auto rounded-lg"
          />
          {/* Lowercase + tight tracking to echo the serif wordmark in the logo */}
          <span className="font-serif text-2xl font-semibold lowercase tracking-tight text-secondary">
            {business.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={desktopLinkClasses(isActiveLink(pathname, link.href))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <CartButton />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-background md:hidden"
          >
            {menuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-black/5 bg-surface px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClasses(isActiveLink(pathname, link.href))}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
