import { z } from "zod";

export const aliasSchema = z.object({
  alias: z.string(),
  source: z.object({ type: z.literal("note"), relativePath: z.string() }).or(
    z.object({
      type: z.literal("inline"),
      content: z.string(),
    })
  ),
  noVariableSubstitution: z.boolean().optional(),
});

export type Alias = z.infer<typeof aliasSchema>;
