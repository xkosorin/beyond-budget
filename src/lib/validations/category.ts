import { z } from "zod";

export const categorySchema = z.object({
  title: z.string().nonempty(),
  imageURL: z.string().url(),
  type: z.enum(["income", "expense", "either"]),
});
