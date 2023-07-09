"use server";

import TransactionGroup from "@/components/transaction/transactionGroup";
import { db } from "@/db";
import { transaction } from "@/db/schema";
import { cn } from "@/lib/utils";
import { TransactionQuery } from "@/types";
import { desc } from "drizzle-orm";

type Props = {
  className?: String;
};

const Transactions = async ({ className }: Props) => {
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
    <div
      className={cn(
        "h-full w-full max-w-[calc(100vw_-_16px)] flex-grow md:max-w-none",
        className
      )}
    >
      <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Transactions
      </div>
      <div className="h-[calc(100%_-_32px)] overflow-y-auto scrollbar-none">
        <div className="flex flex-col gap-2">
          {Object.entries(groupedByDate).map(([date, transactions]) => (
            <TransactionGroup
              key={date}
              date={date}
              transactions={transactions}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
