"use server";

import TransactionOptions from "@/components/transactionOptions";
import { PlannedTransactionQuery } from "@/types";
import Image from "next/image";

type Props = {
  transaction: PlannedTransactionQuery;
};

const PlannedTransaction = ({ transaction }: Props) => {
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="w-fit flex-shrink-0 pr-5">
        <Image
          src={transaction.category.imageURL}
          alt="Cat"
          width={24}
          height={24}
          className="self-center"
        />
      </div>
      <div className="flex min-w-0 flex-grow flex-col">
        <div className=" flex-shrink-0 gap-2 truncate align-middle">
          {transaction.title}
        </div>
      </div>
      <div className="flex flex-row gap-2 whitespace-nowrap px-1 text-sm md:px-4 md:text-base md:font-bold">
        {transaction.paid && <span className="text-[#3FCF8E]">PAID</span>}
        {transaction.frequecny + "x"}
      </div>
      <div className="ml-auto w-fit min-w-[80px] whitespace-nowrap px-1 text-right text-sm font-bold md:px-4 md:text-base xl:min-w-[120px]">
        {(transaction.isExpense ? "- " : "+  ") +
          Number(transaction.amount).toFixed(2) +
          " €"}
      </div>
      <div className="w-fit">
        <TransactionOptions forTransaction={transaction.uuid} planned={true} />
      </div>
    </div>
  );
};

export default PlannedTransaction;
