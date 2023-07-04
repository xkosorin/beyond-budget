"use client";

import { updatePlannedTransactionAction } from "@/app/_actions/transaction";
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
import { PlannedTransactionType } from "@/db/schema";
import { cn } from "@/lib/utils";
import { updatePlannedTransactionSchema } from "@/lib/validations/transaction";
import { CategorySelect } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type Inputs = z.infer<typeof updatePlannedTransactionSchema>;

type Props = {
  transaction: PlannedTransactionType;
  categories: CategorySelect[];
  doCloseDialog: () => void;
};

const UpdatePlannedTransactionForm = ({
  transaction,
  categories,
  doCloseDialog,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(updatePlannedTransactionSchema),
    defaultValues: {
      categoryUUID: transaction.categoryUUID,
      amount: transaction.amount,
      title: transaction.title,
      isExpense: transaction.isExpense,
      frequency: transaction.frequecny,
      dueDate: new Date(transaction.dueDate),
      isPlanned: true,
    },
  });

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      try {
        await updatePlannedTransactionAction({
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
        <FormLabel className="mt-6">Amount</FormLabel>
        <div className="flex flex-row pt-2">
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
            <FormItem className="w-full py-2">
              <FormLabel form="title">Title</FormLabel>
              <FormControl>
                <Input {...form.register("title")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {transaction.isExpense && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="isPlanned"
                  render={() => (
                    <FormItem className="flex items-center justify-start space-y-0 py-2">
                      <FormLabel className="mt-2 min-w-[90px]">
                        Is planned?
                      </FormLabel>
                      <FormControl>
                        <Switch disabled={true} checked={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="w-9/12 py-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
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
                  name="frequency"
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
                          {...form.register("frequency", {
                            setValueAs: (v) =>
                              v === "" ? undefined : parseInt(v),
                          })}
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

export default UpdatePlannedTransactionForm;
