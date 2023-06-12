import { z } from "zod";

export const aliasSchema = z.object({
  alias: z.string(),
  relativePath: z.string(),
  noVariableSubstitution: z.boolean().optional(),
});

export type Alias = z.infer<typeof aliasSchema>;
