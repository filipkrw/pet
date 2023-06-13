import { z } from "zod";
import parseArgvOptions from "../../../cli/parseArgvOptions.js";
import { ArgvOptions } from "../../../cli/types.js";

export type DailyFindArgs = z.infer<typeof schema>;

const schema = z.object({
  tags: z.array(z.string()).optional(),
});

export function parseFindDailyNotesArgv({ argv }: ArgvOptions) {
  const options = parseArgvOptions(
    [{ name: "tags", alias: "t", type: String, multiple: true }],
    argv
  );
  const { tags } = options;
  return Promise.resolve({
    args: schema.parse({ tags }),
  });
}
