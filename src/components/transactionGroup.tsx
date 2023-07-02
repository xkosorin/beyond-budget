"use server";

import { Separator } from "@/components/ui/separator";
import { TransactionWithCategory } from "@/types";
import { format } from "date-fns";
import Transaction from "./transaction";

type Props = {
  transactions: TransactionWithCategory[];
  date: string;
};

const TransactionGroup = ({ transactions, date }: Props) => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-between rounded-md border border-b-4 px-4 py-2">
        <div className="self-start text-xs">
          {format(new Date(date), "PPPP")}
        </div>
        {transactions.map((t, idx, arr) => (
          <>
            <Transaction
              key={t.transaction.uuid}
              transaction={t}
              planned={false}
            />
            {idx !== arr.length - 1 && <Separator />}
          </>
        ))}
      </div>
    </>
  );
};

export default TransactionGroup;
