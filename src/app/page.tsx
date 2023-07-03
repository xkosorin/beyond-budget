import PlannedTransactions from "@/components/plannedTransaction/plannedTransactions";
import AddTransaction from "@/components/addTransaction";
import Transactions from "@/components/transaction/transactions";

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-between gap-2 p-2 md:p-24">
    <Transactions />
    <PlannedTransactions />
    <AddTransaction />
  </main>
);

export default Home;
