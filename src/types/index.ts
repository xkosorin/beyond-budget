import { Category } from "@/db/schema";

export type CategorySelect = Pick<Category, "title" | "uuid" | "type">;
