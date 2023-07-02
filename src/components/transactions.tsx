"use server";

import { db } from "@/db";
import { category, transaction } from "@/db/schema";
import { TransactionWithCategory } from "@/types";
import { desc, eq } from "drizzle-orm";
import TransactionGroup from "./transactionGroup";

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
    <div className="max-w-[calc(100vw_-_16px)] md:max-w-none">
      <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Transactions
      </div>
      <div className="no-scrollbar flex max-h-[290px] flex-col gap-2 overflow-y-auto md:max-h-[calc(100vh_-_150px)]">
        {Object.entries(groupedByDate).map(([date, transactions]) => (
          <TransactionGroup
            key={date}
            date={date}
            transactions={transactions}
          />
        ))}
      </div>
    </div>
  );
};

export default Transactions;
