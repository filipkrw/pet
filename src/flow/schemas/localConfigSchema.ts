import { z } from "zod";

export const localConfigSchema = z.object({
  basePath: z.string(),
  textEditor: z.string().optional(),
});
