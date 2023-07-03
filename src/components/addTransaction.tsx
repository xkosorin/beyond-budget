"use server";

import AddTransactionForm from "@/components/forms/addTransactionForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/db";

const AddTransaction = async () => {
  const categories = await db.query.category.findMany({
    columns: {
      uuid: true,
      title: true,
      type: true,
    },
  });

  return (
    <ScrollArea>
      <AddTransactionForm categories={categories} />
    </ScrollArea>
  );
};

export default AddTransaction;
