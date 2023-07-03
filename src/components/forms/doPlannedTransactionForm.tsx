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
    "title" | "amount" | "isExpense" | "uuid"
  > & { category: CategorySelect };
};

const DoPlannedTransactionForm = ({ plannedTransaction }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(doPlannedTransactionSchema),
    defaultValues: {
      title: plannedTransaction.title,
      amount: plannedTransaction.amount,
      plannedTransactionUUID: plannedTransaction.uuid,
      categoryUUID: plannedTransaction.category.uuid,
    },
  });

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      try {
        // Add product to the store
        await doPlannedTransactionAction({
          ...data,
        });

        toast({ title: "Transaction added successfully." });

        form.reset();
        router.push(`/`);

        const closeButton = document.getElementById("close-dialog");
        if (closeButton) closeButton.click();
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
            <FormItem>
              <FormControl>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={true}
                >
                  <SelectTrigger className="w-full">
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
        <FormLabel className="mt-6">Amount</FormLabel>
        <div className="flex flex-row pt-2">
          <FormField
            control={form.control}
            name="isExpense"
            render={() => (
              <FormItem>
                <FormControl>
                  <Toggle
                    variant="outline"
                    defaultPressed={true}
                    className="rounded-e-none rounded-s-md px-4"
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
                    className="rounded-s-none"
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
            <FormItem className="w-full py-2">
              <FormLabel form="title">Title</FormLabel>
              <FormControl>
                <Input {...form.register("title")} />
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
