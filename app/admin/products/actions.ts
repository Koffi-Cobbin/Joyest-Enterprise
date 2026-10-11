"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductDetails } from "@/data/products";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  uploadProductImage,
  type ProductInput,
} from "@/lib/admin/data";

export type ProductFormState = { error?: string } | null;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseDetails(formData: FormData): ProductDetails | null {
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const benefits = String(formData.get("benefits") ?? "").trim();
  const usage = String(formData.get("usage") ?? "").trim();
  if (!ingredients && !benefits && !usage) return null;
  return {
    ...(ingredients ? { ingredients } : {}),
    ...(benefits ? { benefits } : {}),
    ...(usage ? { usage } : {}),
  };
}

function parseInput(formData: FormData): { input?: ProductInput; error?: string } {
  const id = String(formData.get("id") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = Number(priceRaw);
  const unit = String(formData.get("unit") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const badges = String(formData.get("badges") ?? "")
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);
  const video = String(formData.get("video") ?? "").trim() || null;
  const sortOrderRaw = String(formData.get("sortOrder") ?? "0").trim();
  const sortOrder = Number(sortOrderRaw || "0");

  if (!id || !SLUG_RE.test(id)) {
    return { error: "Id/slug must be lowercase letters, digits and hyphens (e.g. tom-brown)." };
  }
  if (!name) return { error: "Name is required." };
  if (!category) return { error: "Pick a category." };
  if (!Number.isFinite(price) || price < 0) return { error: "Price must be 0 or more." };
  if (!description) return { error: "Description is required." };
  if (!Number.isFinite(sortOrder)) return { error: "Sort order must be a number." };

  return {
    input: {
      id,
      name,
      category,
      price,
      unit,
      description,
      featured,
      badges,
      image: null, // filled by caller (upload / url field)
      video,
      details: parseDetails(formData),
      sortOrder,
    },
  };
}

export async function saveProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const { input, error } = parseInput(formData);
  if (error || !input) return { error };

  const originalId = String(formData.get("originalId") ?? "").trim();
  const isEdit = originalId.length > 0;

  // Image: uploaded file wins; otherwise keep whatever the URL field holds
  const file = formData.get("imageFile");
  try {
    if (file instanceof File && file.size > 0) {
      input.image = await uploadProductImage(file);
    } else {
      input.image = String(formData.get("image") ?? "").trim() || null;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed." };
  }

  try {
    if (isEdit) {
      await updateProduct(originalId, input);
    } else {
      await createProduct(input);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Save failed." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await deleteProduct(id);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}
