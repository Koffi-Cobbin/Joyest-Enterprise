import type { Product } from "@/data/products";

type Size = "sm" | "lg";

const mediaClasses: Record<Size, string> = {
  sm: "aspect-[4/3] w-full",
  lg: "aspect-[4/3] w-full sm:aspect-square",
};

/**
 * Product media with a branded Joyest placeholder until a photo is set.
 * Never renders an empty box — gradient tile + micro-label.
 */
export default function ProductMedia({
  product,
  size = "sm",
}: {
  product: Product;
  size?: Size;
}) {
  if (product.image) {
    return (
      // Plain <img>: placeholder slots are local /public paths; switch to next/image once photos + config land
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image}
        alt={product.name}
        className={`${mediaClasses[size]} rounded-xl object-cover`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-background via-accent/20 to-primary/15 ${mediaClasses[size]}`}
    >
      <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
        Joyest
      </span>
    </div>
  );
}
