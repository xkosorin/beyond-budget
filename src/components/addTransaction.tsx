"use server";

import AddTransactionForm from "@/components/forms/addTransactionForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/db";
import { category } from "@/db/schema";

const AddTransaction = async () => {
  const categories = await db
    .select({ uuid: category.uuid, title: category.title, type: category.type })
    .from(category);

  return (
    <ScrollArea>
      <AddTransactionForm categories={categories} />
    </ScrollArea>
  );
};

export default AddTransaction;
