import TransactionOptions from "@/components/transactionOptions";
import { CategoryType } from "@/db/schema";
import { PlannedTransactionWithCategory } from "@/types";
import { format } from "date-fns";
import Image from "next/image";

type Props = {
  transaction: PlannedTransactionWithCategory;
  category?: CategoryType;
};

const PlannedTransaction = ({ transaction }: Props) => {
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="w-fit flex-shrink-0 pr-5">
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
      <div className="flex min-w-0 flex-grow flex-col">
        <div className=" flex-shrink-0 gap-2 truncate align-middle">
          {transaction.planned_transaction.title}
        </div>
      </div>
      <div className="whitespace-nowrap px-1 text-sm md:px-4 md:text-base md:font-bold">
        {transaction.planned_transaction.frequecny + "x"}
      </div>
      <div className="ml-auto w-fit min-w-[80px] whitespace-nowrap px-1 text-right text-sm font-bold md:px-4 md:text-base xl:min-w-[120px]">
        {(transaction.planned_transaction.isExpense ? "- " : "+  ") +
          Number(transaction.planned_transaction.amount).toFixed(2) +
          " €"}
      </div>
      <div className="w-fit">
        <TransactionOptions
          forTransaction={transaction.planned_transaction.uuid}
          planned={true}
        />
      </div>
    </div>
  );
};

export default PlannedTransaction;
