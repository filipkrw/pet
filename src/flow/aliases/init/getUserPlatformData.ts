import os from "os";
import { z } from "zod";

const schema = z.object({
  shell: z.string(),
  platform: z.string(),
});

export type UserPlatformData = z.infer<typeof schema>;

export function getUserPlatformData() {
  const platformData = schema.parse({
    shell: process.env.SHELL,
    platform: os.platform(),
  });
  return { platformData };
}
