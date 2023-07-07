"use client";

import UpdateTransactionForm from "@/components/forms/updateTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionType } from "@/db/schema";
import { BudgetSelect, CategorySelect } from "@/types";
import React, { useState } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";

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
