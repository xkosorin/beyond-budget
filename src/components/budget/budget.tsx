"use server";

import { BudgetType } from "@/db/schema";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

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
      <Progress
        value={value}
        progressColor={cn(
          value > 60 && "bg-[#3FCF8E]",
          value <= 60 && value > 20 && "bg-[#F6AE2D]",
          value <= 20 && "bg-[#FF6369]"
        )}
      />
    </div>
  );
};

export default Budget;
