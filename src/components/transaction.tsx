import { CategoryType } from "@/db/schema";
import { TransactionWithCategory } from "@/types";
import { format } from "date-fns";
import Image from "next/image";

type Props = {
  transaction: TransactionWithCategory;
  occurencies?: number;
  category?: CategoryType;
  planned: boolean;
};

const Transaction = ({ transaction, planned }: Props) => {
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="w-fit pr-4">
        {transaction.category && transaction.category.imageURL && (
          <Image
            src={transaction.category.imageURL}
            alt="Cat"
            width={24}
            height={24}
            className="self-center"
          />
        )}
      </div>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-2 align-middle">
          {transaction.transaction.title}
        </div>
        {/*         {!planned && (
          <div className="text-[10px] text-[#ededed]">
            {format(new Date(transaction.createdAt), "PPPP")}
          </div>
        )} */}
      </div>
      {/*       {transaction.frequency && (
        <div className="px-1 md:px-4 text-sm md:text-base md:font-bold whitespace-nowrap">
          {occurencies + "x"}
        </div>
      )} */}
      <div className="ml-auto w-fit min-w-[80px] whitespace-nowrap px-1 text-right text-sm font-bold md:px-4 md:text-base xl:min-w-[120px]">
        {(transaction.transaction.isExpense ? "- " : "+  ") +
          Number(transaction.transaction.amount).toFixed(2) +
          " €"}
      </div>
      {/*       <div className="w-fit">
        <TransactionOptions
          transaction={transaction}
          planned={planned}
          onDelete={onDelete}
        />
      </div> */}
    </div>
  );
};

export default Transaction;
