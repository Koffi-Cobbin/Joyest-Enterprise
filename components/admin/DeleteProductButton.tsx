"use client";

import { useRef } from "react";
import { deleteProductAction } from "@/app/admin/products/actions";

export function DeleteProductButton({
  id,
  name,
  fullWidth = false,
}: {
  id: string;
  name: string;
  fullWidth?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={deleteProductAction}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete “${name}”? This cannot be undone.`)) {
            formRef.current?.requestSubmit();
          }
        }}
        className={`inline-flex min-h-11 items-center justify-center rounded-md border border-muted/30 px-4 font-ui text-xs text-muted transition-colors hover:text-clay ${fullWidth ? "w-full" : ""}`}
      >
        Delete
      </button>
    </form>
  );
}
