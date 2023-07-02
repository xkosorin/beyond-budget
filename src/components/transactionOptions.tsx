import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import DeleteTransactionAlert from "./deleteTransactionAlert";

type Props = {
  forTransaction: string;
};

const TransactionOptions = ({ forTransaction }: Props) => {
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
        {/*         {planned ? (
          <>
            <MoveTransactionDialog id={transaction.id} />
            <Separator decorative={true} className="bg-primary my-1" />
            <EditPlannedTransactionDialog id={transaction.id} />
          </>
        ) : (
          <EditTransactionDialog id={transaction.id} />
        )}
 */}
        <DeleteTransactionAlert
          uuid={forTransaction}
        />
      </PopoverContent>
    </Popover>
  );
};

export default TransactionOptions;
