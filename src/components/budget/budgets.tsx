"use server";

import Budget from "@/components/budget/budget";
import { db } from "@/db";
import { BudgetType } from "@/db/schema";
import { cn } from "@/lib/utils";

type Props = {
  className?: String;
};

const Budgets = async ({ className }: Props) => {
  const budgets: BudgetType[] = await db.query.budget.findMany();

  return (
    <div className={cn("max-w-[calc(100vw_-_16px)] md:max-w-none", className)}>
      <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Budgets
      </div>
      <div className="no-scrollbar flex max-h-[290px] flex-col gap-2 overflow-y-auto md:max-h-[calc(100vh_-_150px)]">
        {budgets.map((budget) => (
          <Budget key={budget.uuid} budget={budget} />
        ))}
      </div>
    </div>
  );
};

export default Budgets;
