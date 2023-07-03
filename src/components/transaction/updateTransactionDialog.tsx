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
import { CategorySelect } from "@/types";
import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
  transaction: TransactionType;
  categories: CategorySelect[];
};

const UpdateTransactionDialog = ({
  children,
  transaction,
  categories,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update transaction</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <UpdateTransactionForm
            transaction={transaction}
            categories={categories}
            doCloseDialog={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTransactionDialog;
