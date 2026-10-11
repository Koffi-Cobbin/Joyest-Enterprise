"use client";

import { useRef } from "react";
import { deleteProductAction } from "@/app/admin/products/actions";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
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
        className="font-ui text-xs text-muted transition-colors hover:text-clay"
      >
        Delete
      </button>
    </form>
  );
}
