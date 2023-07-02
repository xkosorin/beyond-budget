"use server";

import { db } from "@/db";
import { CategoryType, category } from "@/db/schema";
import Category from "./category";

const Categories = async () => {
  const categories: CategoryType[] = await db.select().from(category);

  return (
    <div className="max-w-[calc(100vw_-_16px)] md:max-w-none">
      <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Transactions
      </div>
      <div className="no-scrollbar flex max-h-[290px] flex-col gap-2 overflow-y-auto md:max-h-[calc(100vh_-_150px)]">
        {categories.map((category) => (
          <Category key={category.uuid} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
