import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/auth";
import { listCategoriesAdmin } from "@/lib/admin/data";

export const metadata: Metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl">Add product</h1>
      <Suspense fallback={<p className="font-ui text-sm text-muted">Loading…</p>}>
        <NewProductForm />
      </Suspense>
    </div>
  );
}

async function NewProductForm() {
  await requireAdmin();
  const categories = await listCategoriesAdmin();
  return <ProductForm categories={categories} />;
}
