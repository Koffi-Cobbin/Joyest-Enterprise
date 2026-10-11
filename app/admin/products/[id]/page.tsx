import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/auth";
import { getProductAdmin, listCategoriesAdmin } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Edit product" };

// Dynamic admin route without generateStaticParams — the root layout's
// ScrollToTop (usePathname) can't be part of a static shell here, so this
// segment is allowed to block instead of prerendering.
export const instant = false;

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl">Edit product</h1>
      <Suspense fallback={<p className="font-ui text-sm text-muted">Loading…</p>}>
        <EditProductForm params={params} />
      </Suspense>
    </div>
  );
}

async function EditProductForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductAdmin(decodeURIComponent(id)),
    listCategoriesAdmin(),
  ]);
  if (!product) notFound();
  return <ProductForm product={product} categories={categories} />;
}
