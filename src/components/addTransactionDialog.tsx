"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategorySelect } from "@/types";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import AddTransactionForm from "./forms/addTransactionForm";

type Props = {
  categories: CategorySelect[];
};

const AddTransactionDialog = ({ categories }: Props) => {
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
            doCloseDialog={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
