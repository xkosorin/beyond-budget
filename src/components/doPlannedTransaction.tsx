"use server";

import DoPlannedTransactionDialog from "@/components/doPlannedTransactionDialog";
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
      budgetUUID: true,
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
    <>
      {plannedTransactionResult && (
        <DoPlannedTransactionDialog transaction={plannedTransactionResult} />
      )}
    </>
  );
};

export default DoPlannedTransaction;
