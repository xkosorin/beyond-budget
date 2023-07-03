"use server";

import DoPlannedTransactionForm from "@/components/forms/doPlannedTransactionForm";
import { db } from "@/db";
import { plannedTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  uuid: string;
};

const DoPlannedTransaction = async ({ uuid }: Props) => {
  const plannedTransactionResult = await db.query.plannedTransaction.findFirst({
    columns: {
      uuid: true,
      title: true,
      amount: true,
      isExpense: true,
    },
    with: {
      category: {
        columns: {
          uuid: true,
          title: true,
          type: true,
        },
      },
    },
    where: eq(plannedTransaction.uuid, uuid),
  });

  return (
    <div>
      {plannedTransactionResult && (
        <DoPlannedTransactionForm
          plannedTransaction={plannedTransactionResult}
        />
      )}
    </div>
  );
};

export default DoPlannedTransaction;
