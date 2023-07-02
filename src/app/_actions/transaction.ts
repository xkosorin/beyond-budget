"use server";

import { db } from "@/db";
import { plannedTransaction, transaction } from "@/db/schema";
import {
  getTransactionSchema,
  transactionSchema,
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
      isExpense: input.expenseSchema?.isExpense,
      dueDate: input.expenseSchema.plannedSchema.dueDate?.toDateString(),
      frequecny: input.expenseSchema.recurringSchema?.frequency,
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

export async function deleteTransaction(
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
