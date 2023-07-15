"use server";

import { db } from "@/db";
import { budget, plannedTransaction, transaction } from "@/db/schema";
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
  input: z.infer<typeof transactionSchema>,
) {
  const budgetInput = input.budgetUUID === "" ? null : input.budgetUUID;

  if (budgetInput) {
    const budgetResult = await db.query.budget.findFirst({
      where: eq(budget.uuid, budgetInput),
      columns: {
        uuid: true,
      },
    });

    if (!budgetResult) {
      throw new Error("Budget not found.");
    }
  }

  if (input.expenseSchema?.plannedSchema?.isPlanned) {
    //Add planned transaction
    await db.insert(plannedTransaction).values({
      categoryUUID: input.categoryUUID,
      budgetUUID: budgetInput,
      amount: input.amount.toString(),
      title: input.title,
      isExpense: input.expenseSchema.isExpense,
      dueDate: input.expenseSchema.plannedSchema.dueDate.toDateString(),
      frequecny: input.expenseSchema.plannedSchema.frequency,
    });

    revalidatePath(`/`);
    return;
  }

  //Add transaction
  await db.insert(transaction).values({
    categoryUUID: input.categoryUUID,
    amount: input.amount.toString(),
    budgetUUID: budgetInput,
    title: input.title,
    isExpense: input.expenseSchema?.isExpense,
    plannedTransactionUUID: null,
  });

  revalidatePath(`/`);
}

export async function deleteTransactionAction(
  input: z.infer<typeof getTransactionSchema>,
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
  },
) {
  const budgetInput = input.budgetUUID === "" ? null : input.budgetUUID;

  if (budgetInput) {
    const budgetResult = await db.query.budget.findFirst({
      where: eq(budget.uuid, budgetInput),
      columns: {
        uuid: true,
      },
    });

    if (!budgetResult) {
      throw new Error("Budget not found.");
    }
  }

  const transactionResult = await db.query.plannedTransaction.findFirst({
    where: eq(plannedTransaction.uuid, input.plannedTransactionUUID),
    columns: {
      uuid: true,
    },
  });

  if (!transactionResult) {
    throw new Error("Transaction not found.");
  }

  await db.insert(transaction).values({
    categoryUUID: input.categoryUUID,
    amount: input.amount.toString(),
    title: input.title,
    budgetUUID: budgetInput,
    isExpense: input.isExpense,
    plannedTransactionUUID: input.plannedTransactionUUID,
  });

  revalidatePath(`/`);
}

export async function updateTransactionAction(
  input: z.infer<typeof transactionSchema> & {
    uuid: string;
  },
) {
  const transactionResult = await db.query.transaction.findFirst({
    where: eq(transaction.uuid, input.uuid),
    columns: {
      uuid: true,
    },
  });

  if (!transactionResult) {
    throw new Error("Selected transaction not found.");
  }

  let budgetInput = input.budgetUUID === "" ? null : input.budgetUUID;

  if (budgetInput) {
    let budgetResult = await db.query.budget.findFirst({
      where: eq(budget.uuid, budgetInput),
      columns: {
        uuid: true,
      },
    });

    if (!budgetResult) {
      throw new Error("Selected budget not found.");
    }
  }

  await db
    .update(transaction)
    .set({
      categoryUUID: input.categoryUUID,
      amount: input.amount.toString(),
      budgetUUID: budgetInput,
      title: input.title,
    })
    .where(eq(transaction.uuid, input.uuid));

  revalidatePath(`/`);
  return;
}

export async function updatePlannedTransactionAction(
  input: z.infer<typeof updatePlannedTransactionSchema> & {
    uuid: string;
  },
) {
  const transactionResult = await db.query.plannedTransaction.findFirst({
    where: eq(plannedTransaction.uuid, input.uuid),
    columns: {
      uuid: true,
    },
  });

  if (!transactionResult) {
    throw new Error("Transaction not found.");
  }

  let budgetInput = input.budgetUUID === "" ? null : input.budgetUUID;

  if (budgetInput) {
    let budgetResult = await db.query.budget.findFirst({
      where: eq(budget.uuid, budgetInput),
      columns: {
        uuid: true,
      },
    });

    if (!budgetResult) {
      throw new Error("Selected budget not found.");
    }
  }

  await db
    .update(plannedTransaction)
    .set({
      categoryUUID: input.categoryUUID,
      amount: input.amount.toString(),
      title: input.title,
      budgetUUID: budgetInput,
      isExpense: input.isExpense,
      frequecny: input.frequency,
      dueDate: input.dueDate.toDateString(),
    })
    .where(eq(plannedTransaction.uuid, input.uuid));

  revalidatePath(`/`);
}
