"use server";

import { db } from "@/db";
import AddTransactionDialog from "./addTransactionDialog";

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
