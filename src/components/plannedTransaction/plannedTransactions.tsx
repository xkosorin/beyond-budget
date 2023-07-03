"use server";

import PlannedTransactionGroup from "@/components/plannedTransaction/plannedTransactionGroup";
import { db } from "@/db";
import { plannedTransaction } from "@/db/schema";
import { PlannedTransactionQuery } from "@/types";
import { desc } from "drizzle-orm";

const PlannedTransactions = async () => {
  const transactions: PlannedTransactionQuery[] =
    await db.query.plannedTransaction.findMany({
      with: {
        category: true,
      },
      orderBy: [desc(plannedTransaction.createdAt)],
    });

  const groupedByDate = transactions.reduce<
    Record<string, PlannedTransactionQuery[]>
  >((groups, item) => {
    const date = new Date(item.dueDate);
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
    <div className="w-full max-w-[calc(100vw_-_16px)] md:max-w-none">
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
