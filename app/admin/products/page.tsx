import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { AdminSectionHeading } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listCategoriesAdmin, listProductsAdmin } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeading title="Products">
        <Link
          href="/admin/products/new"
          className="rounded-md bg-primary px-4 py-2 font-ui text-sm font-medium text-background transition-colors hover:bg-primary-dark"
        >
          Add product
        </Link>
      </AdminSectionHeading>
      <Suspense fallback={<p className="font-ui text-sm text-muted">Loading products…</p>}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}

async function ProductsTable() {
  await requireAdmin();
  const [products, categories] = await Promise.all([
    listProductsAdmin(),
    listCategoriesAdmin(),
  ]);
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-muted/20 bg-surface px-6 py-10 text-center font-ui text-sm text-muted">
        No products yet — add the first one.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-muted/20 bg-surface">
      <table className="w-full min-w-[640px] text-left font-ui text-sm">
        <thead className="border-b border-muted/15 text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Featured</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/10">
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnails, any URL shape
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-10 rounded-md border border-muted/20 object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-muted/10 text-xs text-muted">
                      —
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted">{p.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted">{categoryName.get(p.category) ?? p.category}</td>
              <td className="px-4 py-3">₵{Number(p.price).toFixed(2)}</td>
              <td className="px-4 py-3">{p.featured ? "★" : ""}</td>
              <td className="px-4 py-3 text-right">
                <span className="flex items-center justify-end gap-4">
                  <Link
                    href={`/admin/products/${encodeURIComponent(p.id)}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
