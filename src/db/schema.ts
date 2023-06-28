import { InferModel, relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const transaction = pgTable("transaction", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  amount: real("amount").default(0.0).notNull(),
  isExpense: boolean("is_expense").default(true).notNull(),
  title: text("title").notNull(),
  categoryUUID: uuid("category_uuid")
    .notNull()
    .references(() => category.uuid),
  plannedTransactionUUID: uuid("planned_transaction_uuid").references(
    () => plannedTransaction.uuid
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactionRelations = relations(transaction, ({ one }) => ({
  category: one(category, {
    fields: [transaction.categoryUUID],
    references: [category.uuid],
  }),
  plannedTransaction: one(plannedTransaction, {
    fields: [transaction.plannedTransactionUUID],
    references: [plannedTransaction.uuid],
  }),
}));

export const categoryTypeEnum = pgEnum("type", ["income", "expense", "either"]);

export const category = pgTable("category", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  title: text("title").notNull(),
  imageURL: text("image_url").notNull(),
  type: categoryTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoryRelations = relations(category, ({ many }) => ({
  transaction: many(transaction),
}));

export const plannedTransaction = pgTable("planned_transaction", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  amount: real("amount").default(0.0).notNull(),
  isExpense: boolean("is_expense").default(true).notNull(),
  frequecny: smallint("frequency").default(1).notNull(),
  occurrencesThisMonth: smallint("occurrences_this_month").default(0).notNull(),
  paid: boolean("is_paid").default(false).notNull(),
  title: text("title").notNull(),
  categoryUUID: uuid("category_uuid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const plannedTransactionRelations = relations(
  plannedTransaction,
  ({ many }) => ({
    transaction: many(transaction),
  })
);

export type Transaction = InferModel<typeof transaction>;
export type Category = InferModel<typeof category>;
export type PlannedTransaction = InferModel<typeof plannedTransaction>;
