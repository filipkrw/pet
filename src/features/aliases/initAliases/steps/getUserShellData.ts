import os from "os";
import path from "path";
import { z } from "zod";
import { getTransformedAliasesPath } from "../../util/getTransformedAliasesPath.js";
import { isZsh } from "../zsh/isZsh.js";

const schema = z.object({
  name: z.string(),
  profileFilePath: z.string(),
  transformedAliasesFilePath: z.string(),
});

export type UserShellData = z.infer<typeof schema>;

export function getUserShellData() {
  const shell = z.string().parse(process.env.SHELL);
  const profileFilePath = getShellProfileFilePath(shell);
  const transformedAliasesFilePath = getShellTransformedAliasesFilePath(shell);

  return {
    shell: schema.parse({
      name: getShellName(shell),
      profileFilePath,
      transformedAliasesFilePath,
    }),
  };
}

function getShellProfileFilePath(shell: string) {
  if (isZsh(shell)) {
    return path.join(os.homedir(), ".zshrc");
  }
}

function getShellTransformedAliasesFilePath(shell: string) {
  if (isZsh(shell)) {
    return path.join(getTransformedAliasesPath(), "zsh_aliases");
  }
}

function getShellName(shell: string) {
  if (isZsh(shell)) {
    return "zsh";
  }
}
