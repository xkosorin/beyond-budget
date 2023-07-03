"use server";

import TransactionGroup from "@/components/transaction/transactionGroup";
import { db } from "@/db";
import { transaction } from "@/db/schema";
import { TransactionQuery } from "@/types";
import { desc } from "drizzle-orm";

const Transactions = async () => {
  const transactions: TransactionQuery[] = await db.query.transaction.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(transaction.createdAt)],
  });

  const groupedByDate = transactions.reduce<Record<string, TransactionQuery[]>>(
    (groups, item) => {
      const date = item.createdAt;
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      groups[dateString].push(item);
      return groups;
    },
    {}
  );

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
