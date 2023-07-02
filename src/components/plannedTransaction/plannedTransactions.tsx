"use server";

import PlannedTransactionGroup from "@/components/plannedTransaction/plannedTransactionGroup";
import { db } from "@/db";
import { category, plannedTransaction } from "@/db/schema";
import { PlannedTransactionWithCategory } from "@/types";
import { desc, eq } from "drizzle-orm";

const PlannedTransactions = async () => {
  const transactions: PlannedTransactionWithCategory[] = await db
    .select()
    .from(plannedTransaction)
    .leftJoin(category, eq(plannedTransaction.categoryUUID, category.uuid))
    .orderBy(desc(plannedTransaction.createdAt));

  const groupedByDate = transactions.reduce<
    Record<string, PlannedTransactionWithCategory[]>
  >((groups, item) => {
    const date = new Date(item.planned_transaction.dueDate);
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
        Planned Transactions
      </div>
      <div className="no-scrollbar flex max-h-[290px] flex-col gap-2 overflow-y-auto md:max-h-[calc(100vh_-_150px)]">
        {Object.entries(groupedByDate).map(([date, transactions]) => (
          <PlannedTransactionGroup
            key={date}
            date={date}
            transactions={transactions}
          />
        ))}
      </div>
    </div>
  );
};

export default PlannedTransactions;
