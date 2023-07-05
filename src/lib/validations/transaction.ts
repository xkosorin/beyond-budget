import { z } from "zod";

const plannedSchema = z
  .object({
    isPlanned: z.boolean().default(false),
    dueDate: z.date().min(new Date()).optional().default(new Date()),
    frequency: z.number().max(31).min(1).optional().default(1),
  })
  .refine((data) => {
    if (data.isPlanned === true) {
      return data.isPlanned && data.dueDate && data.frequency;
    }

    return true;
  });

const expenseSchema = z
  .object({
    isExpense: z.boolean().default(true),
    plannedTransactionUUID: z.string().uuid().optional(),
    plannedSchema: plannedSchema.optional(),
  })
  .refine((data) => {
    if (data.isExpense === true) {
      return data.plannedSchema;
    }

    return true;
  });

export const transactionSchema = z.object({
  categoryUUID: z.string().uuid(),
  amount: z.number().positive(),
  title: z.string(),
  budgetUUID: z.string().refine((data) => {
    if (data !== "") {
      return z.object({ data: z.string().uuid() });
    }

    return true;
  }),
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
  budgetUUID: z.string().refine((data) => {
    if (data !== "") {
      return z.object({ data: z.string().uuid() });
    }

    return true;
  }),
  isExpense: z.boolean().default(true),
  plannedTransactionUUID: z.string().uuid(),
});

export const updateTransactionSchema = z.object({
  categoryUUID: z.string().uuid(),
  amount: z.number().positive(),
  title: z.string(),
  budgetUUID: z.string().refine((data) => {
    if (data !== "") {
      return z.object({ data: z.string().uuid() });
    }

    return true;
  }),
  isExpense: z.boolean(),
});

export const updatePlannedTransactionSchema = z.object({
  categoryUUID: z.string().uuid(),
  amount: z.number().positive(),
  title: z.string(),
  budgetUUID: z.string().refine((data) => {
    if (data !== "") {
      return z.object({ data: z.string().uuid() });
    }

    return true;
  }),
  isExpense: z.boolean(),
  frequency: z.number().max(31).min(1).optional().default(1),
  dueDate: z.date().min(new Date()).optional().default(new Date()),
  isPlanned: z.literal(true),
});
