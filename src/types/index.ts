import {
  CategoryType,
  PlannedTransactionType,
  TransactionType,
} from "@/db/schema";

export type CategorySelect = Pick<CategoryType, "title" | "uuid" | "type">;

export type TransactionQuery = Omit<TransactionType, "categoryUUID"> & {
  category: CategoryType;
};

export type PlannedTransactionQuery = Omit<
  PlannedTransactionType,
  "categoryUUID"
> & { category: CategoryType };
