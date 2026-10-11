"use client";

import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import QuantityPicker from "@/components/QuantityPicker";

/** Qty picker + add-to-cart for the product detail page */
export default function ProductPurchase({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <p className="font-ui text-sm font-semibold uppercase tracking-wide text-muted">
        Quantity
      </p>
      <div className="mt-2">
        <QuantityPicker quantity={quantity} onChange={setQuantity} name="this product" />
      </div>
      <AddToCartButton productId={productId} quantity={quantity} className="mt-6" />
    </div>
  );
}
