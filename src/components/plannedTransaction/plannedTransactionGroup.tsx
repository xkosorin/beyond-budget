"use server";

import { Separator } from "@/components/ui/separator";
import { PlannedTransactionWithCategory } from "@/types";
import { format } from "date-fns";
import PlannedTransaction from "@/components/plannedTransaction/plannedTransaction";

type Props = {
  transactions: PlannedTransactionWithCategory[];
  date: string;
};

const PlannedTransactionGroup = ({ transactions, date }: Props) => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-between rounded-md border border-b-4 px-4 py-2">
        <div className="self-start text-xs">
          Due until: {format(new Date(date), "do")}
        </div>
        {transactions.map((t, idx, arr) => (
          <>
            <PlannedTransaction
              key={t.planned_transaction.uuid}
              transaction={t}
            />
            {idx !== arr.length - 1 && <Separator />}
          </>
        ))}
      </div>
    </>
  );
};

export default PlannedTransactionGroup;
