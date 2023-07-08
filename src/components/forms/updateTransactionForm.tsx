"use client";

import { updateTransactionAction } from "@/app/_actions/transaction";
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
import { TransactionType } from "@/db/schema";
import { updateTransactionSchema } from "@/lib/validations/transaction";
import { BudgetSelect, CategorySelect } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Inputs = z.infer<typeof updateTransactionSchema>;

type Props = {
  transaction: TransactionType;
  categories: CategorySelect[];
  budgets: BudgetSelect[];
  doCloseDialog: () => void;
};

const UpdateTransactionForm = ({
  transaction,
  categories,
  budgets,
  doCloseDialog,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      categoryUUID: transaction.categoryUUID,
      budgetUUID: transaction.budgetUUID || "",
      amount: transaction.amount,
      title: transaction.title,
      isExpense: transaction.isExpense,
    },
  });

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      try {
        await updateTransactionAction({
          ...data,
          uuid: transaction.uuid,
        });

        toast({ title: "Transaction updated successfully." });

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
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {transaction.isExpense
                        ? categories
                            .filter(
                              (cat) =>
                                cat.type === "either" || cat.type === "expense"
                            )
                            .map((cat) => (
                              <SelectItem value={cat.uuid} key={cat.uuid}>
                                {cat.title}
                              </SelectItem>
                            ))
                        : categories
                            .filter(
                              (cat) =>
                                cat.type === "either" || cat.type === "income"
                            )
                            .map((cat) => (
                              <SelectItem value={cat.uuid} key={cat.uuid}>
                                {cat.title}
                              </SelectItem>
                            ))}
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
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Toggle
                    disabled={true}
                    variant="outline"
                    defaultPressed={true}
                    onPressedChange={(event) => {
                      field.onChange(event);
                    }}
                    className="rounded-e-none rounded-s-md px-4"
                  >
                    {transaction.isExpense ? "-" : "+"}
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
            <FormItem className="flex flex-row items-center space-y-2 pt-2">
              <FormLabel form="title" className="mt-2 w-48">
                Title
              </FormLabel>
              <FormControl>
                <Input {...form.register("title")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budgetUUID"
          render={({ field }) => (
            <FormItem className="flex w-full items-center justify-start pt-2">
              <FormLabel form="budget" className="w-48">
                Budget
              </FormLabel>
              <FormControl>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!transaction.isExpense}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={""} key={"default"}>
                        <small className="text-sm font-medium leading-none">
                          Select a budget
                        </small>
                      </SelectItem>
                      {budgets.map((budget) => (
                        <SelectItem value={budget.uuid} key={budget.uuid}>
                          {budget.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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

export default UpdateTransactionForm;
