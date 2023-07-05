import { InferModel, relations } from "drizzle-orm";
import {
  boolean,
  date,
  pgEnum,
  pgTable,
  primaryKey,
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
  budgetUUID: uuid("budget_uuid").references(() => budget.uuid),
  plannedTransactionUUID: uuid("planned_transaction_uuid").references(
    () => plannedTransaction.uuid
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactionRelations = relations(transaction, ({ one, many }) => ({
  category: one(category, {
    fields: [transaction.categoryUUID],
    references: [category.uuid],
  }),
  plannedTransaction: one(plannedTransaction, {
    fields: [transaction.plannedTransactionUUID],
    references: [plannedTransaction.uuid],
  }),
  budget: one(budget, {
    fields: [transaction.budgetUUID],
    references: [budget.uuid],
  }),
  labelToTransaction: many(labelToTransaction),
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
  plannedTransaction: many(plannedTransaction),
}));

export const plannedTransaction = pgTable("planned_transaction", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  amount: real("amount").default(0.0).notNull(),
  isExpense: boolean("is_expense").default(true).notNull(),
  frequecny: smallint("frequency").default(1).notNull(),
  occurrencesThisMonth: smallint("occurrences_this_month").default(0).notNull(),
  dueDate: date("due_date").notNull(),
  paid: boolean("is_paid").default(false).notNull(),
  title: text("title").notNull(),
  budgetUUID: uuid("budget_uuid").references(() => budget.uuid),
  categoryUUID: uuid("category_uuid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const plannedTransactionRelations = relations(
  plannedTransaction,
  ({ one, many }) => ({
    transaction: many(transaction),
    category: one(category, {
      fields: [plannedTransaction.categoryUUID],
      references: [category.uuid],
    }),
    budget: one(budget, {
      fields: [plannedTransaction.budgetUUID],
      references: [budget.uuid],
    }),
  })
);

export const budget = pgTable("budget", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  title: text("title").notNull(),
  size: real("size").default(0.0).notNull(),
  spent: real("spent").default(0.0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgetRelations = relations(budget, ({ many }) => ({
  transaction: many(transaction),
  plannedTransaction: many(plannedTransaction),
}));

export const label = pgTable("label", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  title: text("title").notNull(),
});

export const labelRelations = relations(label, ({ many }) => ({
  labelToTransaction: many(labelToTransaction),
}));

export const labelToTransaction = pgTable(
  "label_to_transaction",
  {
    labelUUID: uuid("label_id")
      .notNull()
      .references(() => label.uuid),
    transactionUUID: uuid("transaction_uuid")
      .notNull()
      .references(() => transaction.uuid),
  },
  (t) => ({
    pk: primaryKey(t.labelUUID, t.transactionUUID),
  })
);

export const labelToTransactionRelations = relations(
  labelToTransaction,
  ({ one }) => ({
    label: one(label, {
      fields: [labelToTransaction.labelUUID],
      references: [label.uuid],
    }),
    transaction: one(transaction, {
      fields: [labelToTransaction.transactionUUID],
      references: [transaction.uuid],
    }),
  })
);

export type TransactionType = InferModel<typeof transaction>;
export type CategoryType = InferModel<typeof category>;
export type PlannedTransactionType = InferModel<typeof plannedTransaction>;
export type BudgetType = InferModel<typeof budget>;
export type LabelType = InferModel<typeof label>;
