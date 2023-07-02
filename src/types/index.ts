import { CategoryType, TransactionType } from "@/db/schema";

export type CategorySelect = Pick<CategoryType, "title" | "uuid" | "type">;

export type TransactionWithCategory = {
  transaction: TransactionType;
  category: CategoryType | null;
};
