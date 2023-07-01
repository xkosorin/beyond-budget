"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Switch } from "../ui/switch";

type Inputs = z.infer<typeof transactionSchema>;

const AddTransactionForm: React.FC = () => {
  const [isExpense, setIsExpense] = useState(true);
  const [isPlanned, setIsPlanned] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      title: "",
    },
  });

  const onSubmit = (data: Inputs) => {
    console.log(data);
  };

  return (
    <ScrollArea className="h-[calc(100vh_-_150px)] max-h-[500px]">
      <Form {...form}>
        <form
          className="flex flex-col group"
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
                        {/*                         {isExpense
                          ? expenseCategories.map((cat) => (
                              <SelectItem value={cat.id} key={cat.id}>
                                {cat.title}
                              </SelectItem>
                            ))
                          : incomeCategories.map((cat) => (
                              <SelectItem value={cat.id} key={cat.id}>
                                {cat.title}
                              </SelectItem>
                            ))} */}
                        <SelectItem
                          value={"6a871854-d594-46f7-a912-f3ebe633a960"}
                          key={1}
                        >
                          {"Lol"}
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
                      className="px-4 rounded-s-md rounded-e-none"
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
                        setValueAs: (v) =>
                          v === "" ? undefined : parseFloat(v),
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
              <FormItem className="py-2 w-full">
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
                      <FormItem className="flex items-center justify-start py-2 mt-6">
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
                      <FormItem className="py-2 w-9/12">
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
                      <FormItem className="flex items-center justify-start py-2 mt-6">
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
                    render={({ field }) => (
                      <FormItem className="py-2 w-9/12">
                        <FormLabel form="frequency">
                          Occurrences per month
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="frequency"
                            type="number"
                            step="1"
                            min={1}
                            max={31}
                            value={field.value}
                            disabled={!isRecurring}
                            onChange={(event) => field.onChange(event)}
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
          <Button type="submit" className="mt-4">
            Save
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default AddTransactionForm;
