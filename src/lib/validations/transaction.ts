import { z } from "zod";

const baseAddSchema = z.object({
  title: z.string(),
  categoryUUID: z.string(),
  amount: z.number().positive(),
});

export const addTransaction = z.discriminatedUnion("isExpense", [
  z
    .object({
      isExpense: z.literal(true),
      plannedTransactionUUID: z.string().optional(),
      isPlanned: z.boolean().optional(),
      isRecurring: z.boolean().optional(),
      frequency: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().max(31).min(1).optional()
      ),
      dueDate: z.date().min(new Date()).optional(),
    })
    .merge(baseAddSchema),
  z
    .object({
      isExpense: z.literal(false),
      isPlanned: z.boolean(),
      isRecurring: z.boolean(),
      frequency: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().max(31).min(1)
      ),
      dueDate: z.date().min(new Date()).optional(),
    })
    .merge(baseAddSchema),
]);
