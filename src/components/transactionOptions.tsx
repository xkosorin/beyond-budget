import DeleteTransactionAlert from "@/components/deleteTransactionAlert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ArrowTopRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import DoPlannedTransaction from "./doPlannedTransaction";

type Props = {
  forTransaction: string;
  planned: boolean;
};

const TransactionOptions = ({ forTransaction, planned }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <ChevronDownIcon />
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col border p-1"
        side="bottom"
        align="end"
      >
        {planned && (
          <>
            <DoPlannedTransaction uuid={forTransaction}>
              {
                <button className="inline-flex h-8 items-center justify-start gap-2 px-1 text-sm font-medium underline-offset-4 hover:underline">
                  <ArrowTopRightIcon /> Execute transaction
                </button>
              }
            </DoPlannedTransaction>
            <Separator decorative={true} className="my-1 bg-primary" />
          </>
        )}
        <DeleteTransactionAlert
          uuid={forTransaction}
          isPlannedTransaction={planned}
        />
      </PopoverContent>
    </Popover>
  );
};

export default TransactionOptions;
