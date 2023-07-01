"use server";

import AddTransactionForm from "@/components/forms/addTransactionForm";
import { db } from "@/db";
import { category } from "@/db/schema";
import { ScrollArea } from "./ui/scroll-area";

export default async function AddTransaction() {
  const categories = await db
    .select({ uuid: category.uuid, title: category.title, type: category.type })
    .from(category);

  return (
    <ScrollArea className="">
      <AddTransactionForm categories={categories} />
    </ScrollArea>
  );
}
