import PlannedTransactions from "@/components/plannedTransaction/plannedTransactions";
import AddTransaction from "@/components/addTransaction";
import Transactions from "@/components/transaction/transactions";
import Budgets from "@/components/budget/budgets";

const Home = () => (
  <main className="mb-10 flex min-h-screen flex-col items-start justify-start gap-3 p-2 scrollbar-none md:mb-0 md:p-10 lg:grid lg:max-h-screen lg:grid-cols-2 lg:gap-12">
    <div className="h-[75vh] w-full lg:h-[calc(100vh_-_80px)]">
      <Transactions />
    </div>
    <div className="flex w-full flex-col gap-3 md:grid md:grid-cols-2 md:gap-2 lg:grid-cols-1">
      <Budgets />
      <PlannedTransactions />
    </div>
    <AddTransaction />
  </main>
);

export default Home;
