"use server";

import { CategoryType } from "@/db/schema";
import Image from "next/image";

type Props = {
  category: CategoryType;
};

const Category = ({ category }: Props) => {
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="w-fit flex-shrink-0 pr-5">
        <Image
          src={category.imageURL}
          alt="Cat"
          width={24}
          height={24}
          className="self-center"
        />
      </div>
      <div className="flex min-w-0 flex-grow flex-col">
        <div className=" flex-shrink-0 gap-2 truncate align-middle">
          {category.title}
        </div>
      </div>
      <div className="ml-auto w-fit min-w-[80px] whitespace-nowrap px-1 text-right text-sm font-bold md:px-4 md:text-base xl:min-w-[120px]">
        {category.type}
      </div>
    </div>
  );
};

export default Category;
