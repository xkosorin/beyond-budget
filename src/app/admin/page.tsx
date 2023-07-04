import AddBudget from "@/components/budget/addBudget";
import Budgets from "@/components/budget/budgets";
import AddCategory from "@/components/category/addCategory";
import Categories from "@/components/category/categories";

const CategoryAdminPage = () => (
  <main className="flex min-h-screen flex-row items-stretch justify-center gap-6 p-2 md:p-24">
    <div>
      <Categories />
      <AddCategory />
    </div>
    <div>
      <Budgets />
      <AddBudget />
    </div>
  </main>
);

export default CategoryAdminPage;
