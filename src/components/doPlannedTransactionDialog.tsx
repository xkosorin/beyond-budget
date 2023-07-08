"use client";

import DoPlannedTransactionForm from "@/components/forms/doPlannedTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PlannedTransactionType } from "@/db/schema";
import { CategorySelect } from "@/types";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type Props = {
  transaction: Pick<
    PlannedTransactionType,
    "title" | "amount" | "isExpense" | "uuid" | "budgetUUID"
  > & { category: CategorySelect };
};

const DoPlannedTransactionDialog = ({ transaction }: Props) => {
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
          <ArrowTopRightIcon /> Execute transaction
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new transaction</DialogTitle>
        </DialogHeader>
        <DoPlannedTransactionForm
          plannedTransaction={transaction}
          doCloseDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DoPlannedTransactionDialog;
