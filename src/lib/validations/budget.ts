import { budget } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const budgetSchema = createInsertSchema(budget, {
  size: (schema) => schema.size.positive(),
});
