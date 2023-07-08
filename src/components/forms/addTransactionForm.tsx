"use client";

import { addTransactionAction } from "@/app/_actions/transaction";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { transactionSchema } from "@/lib/validations/transaction";
import { BudgetSelect, CategorySelect } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type Inputs = z.infer<typeof transactionSchema>;

type Props = {
  categories: CategorySelect[];
  budgets: BudgetSelect[];
  doCloseDialog: () => void;
};

const AddTransactionForm = ({ categories, budgets, doCloseDialog }: Props) => {
  const [isExpense, setIsExpense] = useState(true);
  const [isPlanned, setIsPlanned] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      title: "",
      budgetUUID: "",
      expenseSchema: {
        plannedSchema: {
          dueDate: new Date(Date.now()),
          frequency: 1,
        },
      },
    },
  });

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      try {
        await addTransactionAction({
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
                >
                  <SelectTrigger className="mt-0 w-full py-0">
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
        <div className="flex flex-row items-center space-y-2 pt-2">
          <FormLabel className="w-[calc(12rem_+_20px)]">Amount</FormLabel>
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
                    className="rounded-e-none rounded-s-md border-e-0 px-4"
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
                  disabled={!isExpense}
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
        {isExpense && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="expenseSchema.plannedSchema.isPlanned"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-start space-y-0 py-2">
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
                  render={({ field }) => (
                    <FormItem className="w-9/12 py-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={!isPlanned}
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="expenseSchema.plannedSchema.frequency"
                  render={() => (
                    <FormItem className="flex w-full items-center justify-start gap-2 py-2">
                      <FormLabel form="frequency" className="mt-2 shrink-0">
                        Occurrences per month
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          min={1}
                          max={31}
                          disabled={!isPlanned}
                          {...form.register(
                            "expenseSchema.plannedSchema.frequency",
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
