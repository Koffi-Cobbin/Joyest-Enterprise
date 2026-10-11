"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { setOrderStatus, type OrderStatus } from "@/lib/admin/data";

const STATUSES: readonly OrderStatus[] = [
  "new",
  "confirmed",
  "fulfilled",
  "cancelled",
];

export async function setOrderStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as OrderStatus;
  if (!id || !STATUSES.includes(status)) return;
  await setOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
