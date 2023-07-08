"use server";

import DeleteTransactionAlert from "@/components/deleteTransactionAlert";
import DoPlannedTransaction from "@/components/doPlannedTransaction";
import UpdatePlannedTransaction from "@/components/plannedTransaction/updatePlannedTransaction";
import UpdateTransaction from "@/components/transaction/updateTransaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

type Props = {
  forTransaction: string;
  planned: boolean;
};

const TransactionOptions = ({ forTransaction, planned }: Props) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {planned ? (
          <>
            <DoPlannedTransaction uuid={forTransaction} />
            <UpdatePlannedTransaction uuid={forTransaction} />
          </>
        ) : (
          <UpdateTransaction uuid={forTransaction} />
        )}
        <DropdownMenuSeparator />
        <DeleteTransactionAlert
          uuid={forTransaction}
          isPlannedTransaction={planned}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionOptions;
