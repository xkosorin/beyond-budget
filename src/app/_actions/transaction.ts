"use server";

import { db } from "@/db";
import { plannedTransaction, transaction } from "@/db/schema";
import { transactionSchema } from "@/lib/validations/transaction";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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

export async function getTransactions() {}
