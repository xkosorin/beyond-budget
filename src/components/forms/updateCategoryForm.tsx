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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/db/schema";
import { categorySchema } from "@/lib/validations/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { updateCategoryAction } from "@/app/_actions/category";

type Props = {
  category: CategoryType;
};

type Inputs = z.infer<typeof categorySchema>;

const UpdateCategoryForm = ({ category }: Props) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category.title,
      imageURL: category.imageURL,
      type: category.type,
    },
  });

  const onSubmit = (data: Inputs) => {
    console.log(data);
    startTransition(async () => {
      try {
        // Add product to the store
        await updateCategoryAction({
          ...data,
          uuid: category.uuid,
        });

        toast({ title: "Category updated successfully." });

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
                  <Input
                    {...form.register("title")}
                    defaultValue={category.title}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageURL"
          render={() => (
            <FormItem className="w-full py-2">
              <FormLabel form="imageURL">Image URL</FormLabel>
              <FormControl>
                <Input
                  {...form.register("imageURL")}
                  defaultValue={category.imageURL}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel form="type">Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  name={field.name}
                  value={field.value}
                  defaultValue={category.type}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="either">Either</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4" disabled={isPending}>
          Update category
        </Button>
      </form>
    </Form>
  );
};

export default UpdateCategoryForm;
