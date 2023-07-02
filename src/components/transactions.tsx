"use server";

import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import TransactionGroup from "./transactionGroup";
import { TransactionType, category, transaction } from "@/db/schema";
import { TransactionWithCategory } from "@/types";

const Transactions = async () => {
  const transactions: TransactionWithCategory[] = await db
    .select()
    .from(transaction)
    .leftJoin(category, eq(transaction.categoryUUID, category.uuid))
    .orderBy(desc(transaction.createdAt));

  const groupedByDate = transactions.reduce<
    Record<string, TransactionWithCategory[]>
  >((groups, item) => {
    const date = item.transaction.createdAt;
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(item);
    return groups;
  }, {});

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(groupedByDate).map(([date, transactions]) => (
        <TransactionGroup key={date} date={date} transactions={transactions} />
      ))}
    </div>
  );
};

export default Transactions;
