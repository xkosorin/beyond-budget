"use server";

import { BudgetType } from "@/db/schema";
import { Progress } from "../ui/progress";

type Props = {
  budget: BudgetType;
};

const Budget = ({ budget }: Props) => {
  const value = ((budget.size - budget.spent) / budget.size) * 100;

  return (
    <div className="flex w-full flex-col items-start justify-between gap-4 py-2">
      <div className="flex-shrink-0 gap-2 truncate">{budget.title}</div>
      <div className="w-full min-w-[80px] whitespace-nowrap px-1 text-sm font-bold md:px-4 md:text-base xl:min-w-[120px]">
        {budget.size - budget.spent} / {budget.size}
        <Progress value={value} />
      </div>
    </div>
  );
};

export default Budget;
