"use client";

import { doPlannedTransactionAction } from "@/app/_actions/transaction";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/use-toast";
import { PlannedTransactionType } from "@/db/schema";
import { doPlannedTransactionSchema } from "@/lib/validations/transaction";
import { CategorySelect } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = z.infer<typeof doPlannedTransactionSchema>;

type Props = {
  plannedTransaction: Pick<
    PlannedTransactionType,
    "title" | "amount" | "isExpense" | "uuid" | "budgetUUID"
  > & { category: CategorySelect };
  doCloseDialog: () => void;
};

const DoPlannedTransactionForm = ({
  plannedTransaction,
  doCloseDialog,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(doPlannedTransactionSchema),
    defaultValues: {
      title: plannedTransaction.title,
      amount: Number(plannedTransaction.amount),
      plannedTransactionUUID: plannedTransaction.uuid,
      categoryUUID: plannedTransaction.category.uuid,
      budgetUUID: plannedTransaction.budgetUUID || "",
    },
  });

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      try {
        await doPlannedTransactionAction({
          ...data,
        });

        toast({ title: "Transaction added successfully." });

        form.reset();
        router.push(`/`);
        doCloseDialog();
      } catch (error) {
        error instanceof Error
          ? toast({ title: error.message })
          : toast({ title: "Something went wrong, please try again." });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="group flex flex-col p-[1px]"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="categoryUUID"
          render={({ field }) => (
            <FormItem className="flex w-full items-center justify-start pt-2">
              <FormLabel form="category" className="mt-2 w-48">
                Category
              </FormLabel>
              <FormControl>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={true}
                >
                  <SelectTrigger className="mt-0 w-full py-0">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem
                        value={plannedTransaction.category.uuid}
                        key={plannedTransaction.category.uuid}
                      >
                        {plannedTransaction.category.title}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center space-y-2 pt-2">
          <FormLabel className="w-[calc(12rem_+_20px)]">Amount</FormLabel>
          <FormField
            control={form.control}
            name="isExpense"
            render={() => (
              <FormItem>
                <FormControl>
                  <Toggle
                    variant="outline"
                    defaultPressed={true}
                    className="rounded-e-none rounded-s-md border-e-0 px-4"
                    disabled={true}
                  >
                    {plannedTransaction.isExpense ? "-" : "+"}
                  </Toggle>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={() => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="number"
                    pattern="[0-9]+([\.,][0-9]+)?"
                    step="0.01"
                    className="mt-0 w-full rounded-s-none py-0"
                    {...form.register("amount", {
                      setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="title"
          render={() => (
            <FormItem className="flex w-full items-center justify-start pt-2">
              <FormLabel form="title" className="w-48">
                Title
              </FormLabel>
              <FormControl>
                <Input className="w-full py-0" {...form.register("title")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4" disabled={isPending}>
          Save transaction
        </Button>
      </form>
    </Form>
  );
};

export default DoPlannedTransactionForm;
