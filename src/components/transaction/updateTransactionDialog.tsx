"use client";

import UpdateTransactionForm from "@/components/forms/updateTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionType } from "@/db/schema";
import { BudgetSelect, CategorySelect } from "@/types";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

type Props = {
  transaction: TransactionType;
  categories: CategorySelect[];
  budgets: BudgetSelect[];
};

const UpdateTransactionDialog = ({
  transaction,
  categories,
  budgets,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
          }}
          className="flex gap-2"
        >
          <Pencil1Icon /> Edit transaction
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update transaction</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <UpdateTransactionForm
            transaction={transaction}
            categories={categories}
            budgets={budgets}
            doCloseDialog={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTransactionDialog;
