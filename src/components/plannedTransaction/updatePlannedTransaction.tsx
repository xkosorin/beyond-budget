"use server";

import UpdatePlannedTransactionDialog from "@/components/plannedTransaction/updatePlannedTransactionDialog";
import { db } from "@/db";
import { plannedTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  uuid: string;
};

const UpdatePlannedTransaction = async ({ uuid }: Props) => {
  const transactionResult = await db.query.plannedTransaction.findFirst({
    where: eq(plannedTransaction.uuid, uuid),
  });

  const categories = await db.query.category.findMany({
    columns: {
      uuid: true,
      title: true,
      type: true,
    },
  });

  const budgets = await db.query.budget.findMany({
    columns: {
      uuid: true,
      title: true,
    },
  });

  return (
    <>
      {transactionResult && (
        <UpdatePlannedTransactionDialog
          transaction={transactionResult}
          categories={categories}
          budgets={budgets}
        />
      )}
    </>
  );
};

export default UpdatePlannedTransaction;
