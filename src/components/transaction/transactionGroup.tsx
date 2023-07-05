"use server";

import Transaction from "@/components/transaction/transaction";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TransactionQuery } from "@/types";
import { format } from "date-fns";

type Props = {
  transactions: TransactionQuery[];
  date: string;
};

const TransactionGroup = ({ transactions, date }: Props) => {
  const cumulativeAmount = transactions
    .reduce((sum, transaction) => {
      if (transaction.isExpense) {
        return sum - transaction.amount;
      }
      return sum + transaction.amount;
    }, 0)
    .toFixed(2);

  return (
    <>
      <div className="flex w-full flex-col items-center justify-between rounded-md border border-b-4 px-4 py-2">
        <div className="flex w-full justify-between text-xs">
          <div>{format(new Date(date), "PPPP")}</div>
          <div>
            Spent this day:{" "}
            <span
              className={cn(
                "font-bold",
                parseFloat(cumulativeAmount) < 0 && "text-[#FF6369]",
                parseFloat(cumulativeAmount) > 0 && "text-[#3FCF8E]"
              )}
            >
              {cumulativeAmount} €
            </span>
          </div>
        </div>
        {transactions.map((t, idx, arr) => (
          <>
            <Transaction key={t.uuid} transaction={t} />
            {idx !== arr.length - 1 && <Separator />}
          </>
        ))}
      </div>
    </>
  );
};

export default TransactionGroup;
