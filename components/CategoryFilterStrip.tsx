"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CategoryId } from "@/data/categories";

type CategoryOption = { id: CategoryId; name: string };

const tabClasses = (active: boolean): string =>
  `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-11 inline-flex items-center ${
    active ? "bg-secondary text-background" : "bg-surface text-foreground hover:text-primary"
  }`;

/**
 * Horizontal-scroll filter strip (phones) that centers the active chip on
 * mount so it is never scrolled out of view when arriving from a footer link.
 * On sm+ the row wraps and stays centered (scroll is a no-op there).
 */
export default function CategoryFilterStrip({
  categories,
  activeCategory,
}: {
  categories: readonly CategoryOption[];
  activeCategory: CategoryId | undefined;
}) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    // Center the chip horizontally within the strip ONLY.
    // scrollIntoView would also scroll the page vertically (hiding the header
    // above the search bar), so we set nav.scrollLeft directly — it is a purely
    // horizontal scroll container axis and cannot move the page.
    const target =
      active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: "instant" });
    // Safety: some browsers leak a vertical page scroll from nav.scrollTo.
    // Snap the page back to the top; a no-op when it's already at 0.
    if (window.scrollY > 0) window.scrollTo(0, 0);
  }, [activeCategory]);

  return (
    <nav
      ref={navRef}
      aria-label="Product categories"
      className="no-scrollbar -mx-4 mt-5 flex items-start gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-8 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0"
    >
      <Link href="/shop" className={tabClasses(activeCategory === undefined)} data-active={activeCategory === undefined}>
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/shop?category=${category.id}`}
          className={tabClasses(activeCategory === category.id)}
          data-active={activeCategory === category.id}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
