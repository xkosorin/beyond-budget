import { updateBudgetAction } from "@/app/_actions/budget";
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
import { useToast } from "@/components/ui/use-toast";
import { BudgetType } from "@/db/schema";
import { budgetSchema } from "@/lib/validations/budget";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  budget: BudgetType;
};

type Inputs = z.infer<typeof budgetSchema>;

const AddBudgetForm = ({ budget }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      title: budget.title,
      size: budget.size,
    },
  });

  const onSubmit = (data: Inputs) => {
    startTransition(async () => {
      try {
        // Add product to the store
        await updateBudgetAction({
          ...data,
          uuid: budget.uuid,
        });

        toast({ title: "Budget updated successfully." });

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
        <div className="flex flex-row pt-2">
          <FormField
            control={form.control}
            name="title"
            render={() => (
              <FormItem>
                <FormLabel form="title">Title</FormLabel>
                <FormControl>
                  <Input {...form.register("title")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="size"
          render={() => (
            <FormItem className="w-full py-2">
              <FormLabel form="size">Size</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  pattern="[0-9]+([\.,][0-9]+)?"
                  step="0.01"
                  {...form.register("size", {
                    setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4" disabled={isPending}>
          Update budget
        </Button>
      </form>
    </Form>
  );
};

export default AddBudgetForm;
