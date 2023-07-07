"use client";

import UpdatePlannedTransactionForm from "@/components/forms/updatePlannedTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlannedTransactionType } from "@/db/schema";
import { BudgetSelect, CategorySelect } from "@/types";
import React, { useState } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";

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
