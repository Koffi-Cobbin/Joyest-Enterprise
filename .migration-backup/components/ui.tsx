import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function SectionHeading({ kicker, title, text, href, linkText }: { kicker: string; title: string; text?: string; href?: string; linkText?: string }) {
  return <div className="section-heading">
    <div><Eyebrow>{kicker}</Eyebrow><h2 className="serif">{title}</h2>{text && <p>{text}</p>}</div>
    {href && <Link href={href} className="text-link">{linkText ?? "Explore"} <ArrowRight size={16} /></Link>}
  </div>;
}

export function EmptyState({ title, text, href = "/shop", link = "Browse the shop" }: { title: string; text: string; href?: string; link?: string }) {
  return <div className="empty-state">
    <span className="empty-icon"><Leaf size={22} /></span><h2 className="serif">{title}</h2>
    <p>{text}</p><Link className="button button-outline" href={href}>{link}<ArrowRight size={16} /></Link>
  </div>;
}

export function Price({ amount }: { amount: number }) {
  return <span className="price">GH₵{Number(amount).toFixed(2)}</span>;
}
