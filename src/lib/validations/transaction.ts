import { z } from "zod";

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const plannedSchema = z
  .object({
    isPlanned: z.boolean().default(false),
    dueDate: z.date().min(new Date()).optional().default(new Date()),
  })
  .refine((data) => {
    if (data.isPlanned === true) {
      return data.isPlanned && data.dueDate;
    }

    return true;
  });

const recurringSchema = z
  .object({
    isRecurring: z.boolean().default(false),
    frequency: z.number().max(31).min(1).optional().default(1),
  })
  .refine((data) => {
    if (data.isRecurring === true) {
      return data.isRecurring && data.frequency;
    }

    return true;
  });

const expenseSchema = z
  .object({
    isExpense: z.boolean().default(true),
    plannedTransactionUUID: z.string().uuid().optional(),
    plannedSchema: plannedSchema.optional(),
    recurringSchema: recurringSchema.optional(),
  })
  .refine((data) => {
    if (data.isExpense === true) {
      return data.plannedSchema && data.recurringSchema;
    }

    return true;
  });

export const transactionSchema = z.object({
  categoryUUID: z.string().uuid(),
  amount: z.number().positive(),
  title: z.string(),
  expenseSchema: expenseSchema.optional(),
});

export const getTransactionSchema = z.object({
  uuid: z.string().uuid(),
  isPlannedTransaction: z.boolean(),
});

export const doPlannedTransactionSchema = z.object({
  categoryUUID: z.string().uuid(),
  amount: z.number().positive(),
  title: z.string(),
  isExpense: z.boolean().default(true),
  plannedTransactionUUID: z.string().uuid(),
});

export const updateTransactionSchema = z.object({
  categoryUUID: z.string().uuid(),
  amount: z.number().positive(),
  title: z.string(),
  isExpense: z.boolean(),
});
