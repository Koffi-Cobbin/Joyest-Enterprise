"use client";

import { useRef, useState, useActionState } from "react";
import Link from "next/link";
import type { AdminCategory, AdminProduct } from "@/lib/admin/data";
import { saveProductAction } from "@/app/admin/products/actions";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "w-full rounded-md border border-muted/30 bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelClass = "font-ui text-sm font-medium";
const hintClass = "font-ui text-xs text-muted";

export function ProductForm({
  product,
  categories,
}: {
  product?: AdminProduct;
  categories: readonly AdminCategory[];
}) {
  const isEdit = Boolean(product);
  const [state, formAction, pending] = useActionState(saveProductAction, null);
  const slugEdited = useRef(isEdit);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const details = product?.details ?? {};

  return (
    <form
      action={formAction}
      className="flex max-w-2xl flex-col gap-5 rounded-xl border border-muted/20 bg-surface p-6"
    >
      {product ? <input type="hidden" name="originalId" value={product.id} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClass}>Name</label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name ?? ""}
            onChange={(e) => {
              if (!slugEdited.current) {
                const slugInput = document.getElementById("id") as HTMLInputElement | null;
                if (slugInput) slugInput.value = slugify(e.target.value);
              }
            }}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="id" className={labelClass}>Id / slug</label>
          <input
            id="id"
            name="id"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            defaultValue={product?.id ?? ""}
            readOnly={isEdit}
            onChange={() => { slugEdited.current = true; }}
            className={`${inputClass} ${isEdit ? "cursor-not-allowed opacity-60" : ""}`}
          />
          <p className={hintClass}>
            {isEdit
              ? "Id is fixed after creation — create a new product to use a different id."
              : "Auto-filled from the name; editable."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className={labelClass}>Category</label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category ?? ""}
            className={inputClass}
          >
            <option value="" disabled>Choose…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className={labelClass}>Price (₵)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product ? String(product.price) : ""}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="unit" className={labelClass}>Unit <span className="text-muted">(optional)</span></label>
          <input
            id="unit"
            name="unit"
            defaultValue={product?.unit ?? ""}
            placeholder="per pack"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={product?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="badges" className={labelClass}>Badges <span className="text-muted">(comma-separated, optional)</span></label>
          <input
            id="badges"
            name="badges"
            defaultValue={product?.badges?.join(", ") ?? ""}
            placeholder="Bestseller, New"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sortOrder" className={labelClass}>Sort order</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={product?.sort_order ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3 rounded-md border border-muted/20 p-4">
        <legend className="px-1 font-ui text-sm font-medium">Photo</legend>
        {product?.image ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- external + local URLs, no next.config domains to maintain */}
            <img
              src={product.image}
              alt=""
              className="h-16 w-16 rounded-md border border-muted/20 object-cover"
            />
            <p className={hintClass}>Current image — replace with a file below or edit the URL.</p>
          </div>
        ) : null}
        {previewUrl ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- client-side object URL preview */}
            <img
              src={previewUrl}
              alt=""
              className="h-16 w-16 rounded-md border border-primary/40 object-cover"
            />
            <p className={hintClass}>New image selected — saved when you submit.</p>
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="imageFile" className={labelClass}>Upload image <span className="text-muted">(JPEG/PNG/WebP/AVIF, max 5MB)</span></label>
          <input
            id="imageFile"
            name="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreviewUrl(file ? URL.createObjectURL(file) : null);
            }}
            className="font-ui text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-ui file:text-sm file:text-background"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="image" className={labelClass}>…or image URL / path</label>
          <input
            id="image"
            name="image"
            defaultValue={product?.image ?? ""}
            placeholder="https://… or /products/tom-brown.jpeg"
            className={inputClass}
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="video" className={labelClass}>YouTube link <span className="text-muted">(optional)</span></label>
        <input
          id="video"
          name="video"
          type="url"
          defaultValue={product?.video ?? ""}
          placeholder="https://youtube.com/watch?v=…"
          className={inputClass}
        />
      </div>

      <fieldset className="flex flex-col gap-3 rounded-md border border-muted/20 p-4">
        <legend className="px-1 font-ui text-sm font-medium">Product page details <span className="text-muted">(optional)</span></legend>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ingredients" className={labelClass}>Ingredients</label>
          <textarea id="ingredients" name="ingredients" rows={2} defaultValue={details.ingredients ?? ""} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="benefits" className={labelClass}>Benefits</label>
          <textarea id="benefits" name="benefits" rows={2} defaultValue={details.benefits ?? ""} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="usage" className={labelClass}>Usage</label>
          <textarea id="usage" name="usage" rows={2} defaultValue={details.usage ?? ""} className={inputClass} />
        </div>
      </fieldset>

      <label className="flex items-center gap-2 font-ui text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured ?? false}
          className="h-4 w-4 accent-[var(--color-primary)]"
        />
        Featured (shown on the home page)
      </label>

      {state?.error ? (
        <p role="alert" className="rounded-md bg-clay/10 px-3 py-2 font-ui text-sm text-clay">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-5 py-2.5 font-ui text-sm font-medium text-background transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <Link
          href="/admin/products"
          className="rounded-md border border-muted/30 px-5 py-2.5 font-ui text-sm text-muted transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
