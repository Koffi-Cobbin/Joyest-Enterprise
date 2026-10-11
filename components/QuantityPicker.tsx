"use client";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 50;

type QuantityPickerProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  /** Product name — used to build accessible button labels */
  name: string;
};

/** Clamped 1–50 quantity control with aria-live value (borrowed from Joyest) */
export default function QuantityPicker({
  quantity,
  onChange,
  name,
}: QuantityPickerProps) {
  const clamp = (value: number): number =>
    Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, value));

  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={`Quantity for ${name}`}>
      <button
        type="button"
        aria-label={`Decrease quantity of ${name}`}
        onClick={() => onChange(clamp(quantity - 1))}
        className="flex size-11 items-center justify-center rounded-md border border-foreground/10 font-semibold transition-colors hover:bg-background disabled:opacity-40"
        disabled={quantity <= MIN_QUANTITY}
      >
        −
      </button>
      <span
        aria-live="polite"
        className="w-10 text-center font-semibold tabular-nums"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${name}`}
        onClick={() => onChange(clamp(quantity + 1))}
        className="flex size-11 items-center justify-center rounded-md border border-foreground/10 font-semibold transition-colors hover:bg-background disabled:opacity-40"
        disabled={quantity >= MAX_QUANTITY}
      >
        +
      </button>
    </div>
  );
}
