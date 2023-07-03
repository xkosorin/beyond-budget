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

type Props = {
  children: React.ReactNode;
  transaction: Pick<
    PlannedTransactionType,
    "title" | "amount" | "isExpense" | "uuid"
  > & { category: CategorySelect };
};

const DoPlannedTransactionDialog = ({ children, transaction }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
