"use client";

import AddTransactionForm from "@/components/forms/addTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BudgetSelect, CategorySelect } from "@/types";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type Props = {
  categories: CategorySelect[];
  budgets: BudgetSelect[];
};

const AddTransactionDialog = ({ categories, budgets }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="fixed bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full text-xl font-extrabold leading-[2.75rem] md:left-5 md:right-auto">
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new transaction</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <AddTransactionForm
            categories={categories}
            budgets={budgets}
            doCloseDialog={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
