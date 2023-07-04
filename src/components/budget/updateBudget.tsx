"use server";

import UpdateBudgetForm from "@/components/forms/updateBudgetForm";
import { db } from "@/db";
import { budget } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  uuid: string;
};

const UpdateBudget = async ({ uuid }: Props) => {
  const budgetResult = await db.query.budget.findFirst({
    where: eq(budget.uuid, uuid),
  });

  return (
    <div>{budgetResult && <UpdateBudgetForm budget={budgetResult} />}</div>
  );
};

export default UpdateBudget;
