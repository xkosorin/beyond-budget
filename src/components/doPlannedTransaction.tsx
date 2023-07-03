"use server";

import { db } from "@/db";
import { plannedTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";
import DoPlannedTransactionDialog from "./doPlannedTransactionDialog";

type Props = {
  children: React.ReactNode;
  uuid: string;
};

const DoPlannedTransaction = async ({ children, uuid }: Props) => {
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
    <>
      {plannedTransactionResult && (
        <DoPlannedTransactionDialog transaction={plannedTransactionResult}>
          {children}
        </DoPlannedTransactionDialog>
      )}
    </>
  );
};

export default DoPlannedTransaction;
