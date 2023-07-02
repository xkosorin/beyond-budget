"use client";

import { addTransactionAction } from "@/app/_actions/transaction";
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
import { transactionSchema } from "@/lib/validations/transaction";
import { CategorySelect } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";

type Inputs = z.infer<typeof transactionSchema>;

type Props = {
  categories: CategorySelect[];
};

const AddTransactionForm: React.FC<Props> = ({ categories }) => {
  const [isExpense, setIsExpense] = useState(true);
  const [isPlanned, setIsPlanned] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      title: "",
    },
  });

  const onSubmit = (data: Inputs) => {
    console.log(data);

    startTransition(async () => {
      try {
        // Add product to the store
        await addTransactionAction({
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
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {isExpense
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
        <FormLabel className="mt-6">Amount</FormLabel>
        <div className="flex flex-row pt-2">
          <FormField
            control={form.control}
            name="expenseSchema.isExpense"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Toggle
                    variant="outline"
                    defaultPressed={true}
                    onPressedChange={(event) => {
                      field.onChange(event);
                      setIsExpense(event);
                    }}
                    className="rounded-e-none rounded-s-md px-4"
                  >
                    {isExpense ? "-" : "+"}
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
        {isExpense && (
          <>
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="expenseSchema.plannedSchema.isPlanned"
                  render={({ field }) => (
                    <FormItem className="mt-6 flex items-center justify-start py-2">
                      <FormLabel className="mt-2 min-w-[90px]">
                        Is planned?
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={isPlanned}
                          onCheckedChange={() => {
                            field.onChange(!isPlanned);
                            setIsPlanned(!isPlanned);
                          }}
                          defaultChecked={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expenseSchema.plannedSchema.dueDate"
                  render={() => (
                    <FormItem className="w-9/12 py-2">
                      <FormLabel form="dueDate">Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          disabled={!isPlanned}
                          {...form.register(
                            "expenseSchema.plannedSchema.dueDate",
                            {
                              setValueAs: (v) =>
                                v === "" ? undefined : new Date(v),
                            }
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="expenseSchema.recurringSchema.isRecurring"
                  render={({ field }) => (
                    <FormItem className="mt-6 flex items-center justify-start py-2">
                      <FormLabel className="mt-2 min-w-[90px]">
                        Is recurring?
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={isRecurring}
                          onCheckedChange={() => {
                            field.onChange(!isRecurring);
                            setIsRecurring(!isRecurring);
                          }}
                          defaultChecked={false}
                          disabled={!isPlanned}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expenseSchema.recurringSchema.frequency"
                  render={() => (
                    <FormItem className="w-9/12 py-2">
                      <FormLabel form="frequency">
                        Occurrences per month
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          min={1}
                          max={31}
                          disabled={!isRecurring}
                          {...form.register(
                            "expenseSchema.recurringSchema.frequency",
                            {
                              setValueAs: (v) =>
                                v === "" ? undefined : parseInt(v),
                            }
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        )}
        <Button type="submit" className="mt-4" disabled={isPending}>
          Save transaction
        </Button>
      </form>
    </Form>
  );
};

export default AddTransactionForm;
