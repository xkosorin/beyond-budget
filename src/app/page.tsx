"use client";

import AddTransactionForm from "@/components/forms/addTransactionForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AddTransactionForm  />
    </main>
  );
}
