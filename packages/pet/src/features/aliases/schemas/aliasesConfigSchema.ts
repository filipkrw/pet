import { z } from "zod";
import { aliasSchema } from "./aliasSchema.js";

export const aliasesConfigSchema = z.object({
  aliases: z.array(aliasSchema),
});
