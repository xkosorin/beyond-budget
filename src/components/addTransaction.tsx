"use server";

import AddTransactionDialog from "@/components/addTransactionDialog";
import { db } from "@/db";

const AddTransaction = async () => {
  const categories = await db.query.category.findMany({
    columns: {
      uuid: true,
      title: true,
      type: true,
    },
  });

  return <AddTransactionDialog categories={categories} />;
};

export default AddTransaction;
