"use server";

import { BudgetType } from "@/db/schema";

type Props = {
  budget: BudgetType;
};

const Budget = ({ budget }: Props) => {
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="flex min-w-0 flex-grow flex-col">
        <div className=" flex-shrink-0 gap-2 truncate align-middle">
          {budget.title}
        </div>
      </div>
      <div className="ml-auto w-fit min-w-[80px] whitespace-nowrap px-1 text-right text-sm font-bold md:px-4 md:text-base xl:min-w-[120px]">
        {budget.size}
      </div>
    </div>
  );
};

export default Budget;
