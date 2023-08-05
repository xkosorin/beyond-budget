"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";
import { cn } from "@/lib/utils";
import { sql } from "drizzle-orm";

type Props = {
  className?: String;
};

const Stats = async ({ className }: Props) => {
  const expenses = await db
    .select({ amount: sql<number>`sum(amount)` })
    .from(transaction)
    .where(
      sql`DATE_TRUNC('month'::text, created_at) = DATE_TRUNC('month'::text, ${new Date()}::date) AND is_expense = 'true'::boolean`,
    );

  const incomes = await db
    .select({ amount: sql<number>`sum(amount)` })
    .from(transaction)
    .where(
      sql`DATE_TRUNC('month'::text, created_at) = DATE_TRUNC('month'::text, ${new Date()}::date) AND is_expense = 'false'::boolean`,
    );

  return (
    <div className={cn("max-w-[calc(100vw_-_16px)] md:max-w-none", className)}>
      <div className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight">
        Current month statistics
      </div>
      <div className="flex flex-col gap-4">
        <small className="text-base font-medium leading-none">
          Incomes:{" "}
          <span className="font-bold text-[#3FCF8E]">
            {incomes[0].amount ? incomes[0].amount : "0"} €
          </span>
        </small>
        <small className="text-base font-medium leading-none">
          Expenses:{" "}
          <span className="font-bold text-[#FF6369]">
            {expenses[0].amount} €
          </span>
        </small>
      </div>
    </div>
  );
};

export default Stats;
