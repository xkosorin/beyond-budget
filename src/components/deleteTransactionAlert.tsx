"use client";

import { deleteTransaction } from "@/app/_actions/transaction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { PopoverTrigger } from "@/components/ui/popover";

type Props = {
  uuid: string;
};

const DeleteTransactionAlert = ({ uuid }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await deleteTransaction({ uuid });
        toast({ title: "Transaction deleted successfully." });
      } catch (error) {
        error instanceof Error
          ? toast({ title: error.message })
          : toast({ title: "Something went wrong, please try again." });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="inline-flex h-8 items-center justify-start px-1 text-sm font-medium underline-offset-4 hover:underline">
        <TrashIcon />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <PopoverTrigger asChild>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          </PopoverTrigger>
          <PopoverTrigger asChild>
            <AlertDialogAction onClick={handleClick} disabled={isPending}>
              Delete
            </AlertDialogAction>
          </PopoverTrigger>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionAlert;
