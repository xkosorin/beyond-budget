"use client";

import UpdatePlannedTransactionForm from "@/components/forms/updatePlannedTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlannedTransactionType } from "@/db/schema";
import { BudgetSelect, CategorySelect } from "@/types";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

type Props = {
  transaction: PlannedTransactionType;
  categories: CategorySelect[];
  budgets: BudgetSelect[];
};

const UpdatePlannedTransactionDialog = ({
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
          <UpdatePlannedTransactionForm
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

export default UpdatePlannedTransactionDialog;
