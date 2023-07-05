import PlannedTransactions from "@/components/plannedTransaction/plannedTransactions";
import AddTransaction from "@/components/addTransaction";
import Transactions from "@/components/transaction/transactions";
import Budgets from "@/components/budget/budgets";

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-start gap-2 p-2 md:p-24">
    <Budgets />
    <Transactions />
    <PlannedTransactions />
    <AddTransaction />
  </main>
);

export default Home;
