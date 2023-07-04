"use client";

import { deleteBudget } from "@/app/_actions/budget";
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
import { PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";

type Props = {
  uuid: string;
};

const DeleteBudgetAlert = ({ uuid }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await deleteBudget(uuid);
        toast({ title: "Budget deleted successfully." });
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
            budget.
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

export default DeleteBudgetAlert;
