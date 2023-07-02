import AddCategory from "@/components/category/addCategory";
import Categories from "@/components/category/categories";

const CategoryAdminPage = () => (
  <main className="flex min-h-screen flex-col items-center justify-between gap-2 p-2 md:p-24">
    <Categories />
    <AddCategory />
  </main>
);

export default CategoryAdminPage;
