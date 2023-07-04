"use server";

import { db } from "@/db";
import { budget } from "@/db/schema";
import { budgetSchema } from "@/lib/validations/budget";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addBudgetAction(input: z.infer<typeof budgetSchema>) {
  await db.insert(budget).values({
    title: input.title,
    size: input.size,
  });

  revalidatePath(`/`);
}

export async function updateBudgetAction(
  input: z.infer<typeof budgetSchema> & {
    uuid: string;
  }
) {
  const budgetResult = await db.query.budget.findFirst({
    where: eq(budget.uuid, input.uuid),
  });

  if (!budgetResult) {
    throw new Error("Budget not found.");
  }

  await db.update(budget).set(input).where(eq(budget.uuid, input.uuid));

  revalidatePath(`/`);
}

export async function deleteBudget(uuid: string) {
  await db.delete(budget).where(eq(budget.uuid, uuid));

  revalidatePath(`/`);
}
