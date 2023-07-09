"use server";

import { Progress } from "@/components/ui/progress";
import { BudgetType } from "@/db/schema";

type Props = {
  budget: BudgetType;
};

const Budget = ({ budget }: Props) => {
  const value = Math.floor(((budget.size - budget.spent) / budget.size) * 100);

  return (
    <div className="flex w-full min-w-[80px] flex-col items-start justify-between whitespace-nowrap py-2 text-sm font-bold md:text-base xl:min-w-[120px]">
      <div className="flex w-full flex-row justify-between">
        <div className="flex-shrink-0 gap-2 truncate">{budget.title}</div>
        <span className="self-end">
          {budget.size - budget.spent} / {budget.size} €
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
};

export default Budget;
