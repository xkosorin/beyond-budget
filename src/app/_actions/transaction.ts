"use server";

import { db } from "@/db";
import { transaction } from "@/db/schema";

export async function addTransaction() {
  await db.insert(transaction).values({
    title: "Test",
    amount: 5.99,
    categoryUUID: "6a871854-d594-46f7-a912-f3ebe633a960",
  });
}

export async function getTransactions() {}
