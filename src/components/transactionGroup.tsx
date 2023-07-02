"use server";

import Transaction from "./transaction";
import { TransactionWithCategory } from "@/types";
import { format } from "date-fns";

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
        {transactions.map((t) => (
          <Transaction
            key={t.transaction.uuid}
            transaction={t}
            planned={false}
          />
        ))}
      </div>
    </>
  );
};

export default TransactionGroup;
