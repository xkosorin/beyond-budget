"use client";

import DoPlannedTransactionForm from "@/components/forms/doPlannedTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlannedTransactionType } from "@/db/schema";
import { CategorySelect } from "@/types";
import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

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
