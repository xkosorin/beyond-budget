import AddTransaction from "@/components/addTransaction";
import AddTransactionDialog from "@/components/addTransactionDialog";
import Transactions from "@/components/transactions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-2 p-24">
      <Transactions />
      <AddTransactionDialog>
        <AddTransaction />
      </AddTransactionDialog>
    </main>
  );
}
