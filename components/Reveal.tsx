"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Extra classes for the wrapper */
  className?: string;
  /** Transition delay in ms (stagger siblings) */
  delay?: number;
};

/**
 * Reveal-on-scroll wrapper (borrowed from Joyest).
 * Adds .is-visible via IntersectionObserver; reduced-motion users see content immediately.
 * Only wrap below-fold sections — hero content should not depend on JS.
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Reduced-motion users get content immediately via CSS (.reveal is a no-op under
    // prefers-reduced-motion), so the observer alone is enough here.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
