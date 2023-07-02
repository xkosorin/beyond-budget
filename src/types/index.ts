import {
  CategoryType,
  PlannedTransactionType,
  TransactionType,
} from "@/db/schema";

export type CategorySelect = Pick<CategoryType, "title" | "uuid" | "type">;

export type TransactionWithCategory = {
  transaction: TransactionType;
  category: CategoryType | null;
};

export type PlannedTransactionWithCategory = {
  planned_transaction: PlannedTransactionType;
  category: CategoryType | null;
};
