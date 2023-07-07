"use server";

import UpdateTransactionDialog from "@/components/transaction/updateTransactionDialog";
import { db } from "@/db";
import { transaction } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  uuid: string;
};

const UpdateTransaction = async ({ uuid }: Props) => {
  const transactionResult = await db.query.transaction.findFirst({
    where: eq(transaction.uuid, uuid),
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
        <UpdateTransactionDialog
          transaction={transactionResult}
          categories={categories}
          budgets={budgets}
        />
      )}
    </>
  );
};

export default UpdateTransaction;
