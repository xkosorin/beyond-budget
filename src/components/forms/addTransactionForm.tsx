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
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { transactionSchema } from "@/lib/validations/transaction";
import { CategorySelect } from "@/types";
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
  doCloseDialog: () => void;
};

const AddTransactionForm = ({ categories, doCloseDialog }: Props) => {
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
                    <FormItem className="flex items-center justify-start py-2">
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
                    <FormItem className="mt-2 w-9/12 py-2">
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
