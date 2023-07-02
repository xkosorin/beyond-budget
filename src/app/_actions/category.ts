"use server";

import { db } from "@/db";
import { category } from "@/db/schema";
import { categorySchema } from "@/lib/validations/category";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addCategoryAction(input: z.infer<typeof categorySchema>) {
  await db.insert(category).values({
    title: input.title,
    imageURL: input.imageURL,
    type: input.type,
  });

  revalidatePath(`/`);
}

export async function updateCategoryAction(
  input: z.infer<typeof categorySchema> & {
    uuid: string;
  }
) {
  const categoryResult = await db.query.category.findFirst({
    where: eq(category.uuid, input.uuid),
  });

  if (!categoryResult) {
    throw new Error("Category not found.");
  }

  await db.update(category).set(input).where(eq(category.uuid, input.uuid));

  revalidatePath(`/`);
}

export async function deleteCategory(uuid: string) {
  await db.delete(category).where(eq(category.uuid, uuid));

  revalidatePath(`/`);
}
