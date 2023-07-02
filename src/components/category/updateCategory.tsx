"use server";

import { db } from "@/db";
import { category } from "@/db/schema";
import { eq } from "drizzle-orm";
import UpdateCategoryForm from "../forms/updateCategoryForm";

type Props = {
  uuid: string;
};

const UpdateCategory = async ({ uuid }: Props) => {
  const categoryResult = await db.query.category.findFirst({
    where: eq(category.uuid, uuid),
  });

  return (
    <div>
      {categoryResult && <UpdateCategoryForm category={categoryResult} />}
    </div>
  );
};

export default UpdateCategory;
