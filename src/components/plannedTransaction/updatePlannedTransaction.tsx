"use server";

import UpdatePlannedTransactionDialog from "@/components/plannedTransaction/updatePlannedTransactionDialog";
import { db } from "@/db";
import { plannedTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  children: React.ReactNode;
  uuid: string;
};

const UpdatePlannedTransaction = async ({ children, uuid }: Props) => {
  const transactionResult = await db.query.plannedTransaction.findFirst({
    where: eq(plannedTransaction.uuid, uuid),
  });

  const categories = await db.query.category.findMany();

  return (
    <>
      {transactionResult && (
        <UpdatePlannedTransactionDialog
          transaction={transactionResult}
          categories={categories}
        >
          {children}
        </UpdatePlannedTransactionDialog>
      )}
    </>
  );
};

export default UpdatePlannedTransaction;
