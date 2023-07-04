"use server";

import { db } from "@/db";
import { plannedTransaction, transaction } from "@/db/schema";
import {
  doPlannedTransactionSchema,
  getTransactionSchema,
  transactionSchema,
  updatePlannedTransactionSchema,
} from "@/lib/validations/transaction";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addTransactionAction(
  input: z.infer<typeof transactionSchema>
) {
  if (input.expenseSchema?.plannedSchema?.isPlanned) {
    //Add planned transaction
    await db.insert(plannedTransaction).values({
      categoryUUID: input.categoryUUID,
      amount: input.amount,
      title: input.title,
      isExpense: input.expenseSchema.isExpense,
      dueDate: input.expenseSchema.plannedSchema.dueDate.toDateString(),
      frequecny: input.expenseSchema.plannedSchema.frequency,
    });

    revalidatePath(`/`);
    return;
  }

  if (input.expenseSchema?.plannedTransactionUUID) {
    //Add transaction linked to planned transaction

    revalidatePath(`/`);
    return;
  }

  //Add transaction
  await db.insert(transaction).values({
    categoryUUID: input.categoryUUID,
    amount: input.amount,
    title: input.title,
    isExpense: input.expenseSchema?.isExpense,
    plannedTransactionUUID: null,
  });

  revalidatePath(`/`);
}

export async function deleteTransactionAction(
  input: z.infer<typeof getTransactionSchema>
) {
  if (input.isPlannedTransaction) {
    await db
      .delete(plannedTransaction)
      .where(eq(plannedTransaction.uuid, input.uuid));
  } else {
    await db.delete(transaction).where(eq(transaction.uuid, input.uuid));
  }

  revalidatePath(`/`);
}

export async function doPlannedTransactionAction(
  input: z.infer<typeof doPlannedTransactionSchema> & {
    plannedTransactionUUID: string;
  }
) {
  await db.transaction(async (tx) => {
    await tx.insert(transaction).values({
      categoryUUID: input.categoryUUID,
      amount: input.amount,
      title: input.title,
      isExpense: input.isExpense,
      plannedTransactionUUID: input.plannedTransactionUUID,
    });

    const res = await tx.query.plannedTransaction.findFirst({
      where: eq(plannedTransaction.uuid, input.plannedTransactionUUID),
      columns: {
        occurrencesThisMonth: true,
      },
    });

    if (res) {
      await tx
        .update(plannedTransaction)
        .set({ occurrencesThisMonth: res?.occurrencesThisMonth + 1 })
        .where(eq(plannedTransaction.uuid, input.plannedTransactionUUID));
    }
  });

  revalidatePath(`/`);
}

export async function updateTransactionAction(
  input: z.infer<typeof transactionSchema> & {
    uuid: string;
  }
) {
  const transactionResult = await db.query.transaction.findFirst({
    where: eq(transaction.uuid, input.uuid),
  });

  if (!transactionResult) {
    throw new Error("Transaction not found.");
  }

  await db
    .update(transaction)
    .set(input)
    .where(eq(transaction.uuid, input.uuid));

  revalidatePath(`/`);
}

export async function updatePlannedTransactionAction(
  input: z.infer<typeof updatePlannedTransactionSchema> & {
    uuid: string;
  }
) {
  const transactionResult = await db.query.plannedTransaction.findFirst({
    where: eq(plannedTransaction.uuid, input.uuid),
  });

  if (!transactionResult) {
    throw new Error("Transaction not found.");
  }

  await db
    .update(plannedTransaction)
    .set({
      categoryUUID: input.categoryUUID,
      amount: input.amount,
      title: input.title,
      isExpense: input.isExpense,
      frequecny: input.frequency,
      dueDate: input.dueDate.toDateString(),
    })
    .where(eq(plannedTransaction.uuid, input.uuid));

  revalidatePath(`/`);
}
