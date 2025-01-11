import os from "os";
import path from "path";
import { z } from "zod";
import { getTransformedAliasesPath } from "../../util/getTransformedAliasesPath.js";
import { isZsh } from "../zsh/isZsh.js";
import { PetError } from "../../../../core/PetError.js";
import { execSync } from "child_process";

const schema = z.object({
  name: z.enum(["zsh", "nu"]),
  profileFilePath: z.string(),
  transformedAliasesFilePath: z.string(),
});

export type UserShellData = z.infer<typeof schema>;

type Shell = "zsh" | "nu";

export function getUserShellData() {
  const shell = getShellName();

  if (shell === undefined) {
    throw new PetError("Shell not supported");
  }

  const profileFilePath = getShellProfileFilePath(shell);
  const transformedAliasesFilePath = getShellTransformedAliasesFilePath(shell);

  return {
    shell: schema.parse({
      name: shell,
      profileFilePath,
      transformedAliasesFilePath,
    }),
  };
}

function getShellProfileFilePath(shell: Shell) {
  if (shell === "zsh") {
    return path.join(os.homedir(), ".zshrc");
  }
  if (shell === "nu") {
    return execSync("$nu.config-path", {
      encoding: "utf8",
      shell: "nu",
    }).trim();
  }
}

function getShellTransformedAliasesFilePath(shell: Shell) {
  if (shell === "zsh") {
    return path.join(getTransformedAliasesPath(), "zsh_aliases");
  }
  if (shell === "nu") {
    return path.join(getTransformedAliasesPath(), "aliases.nu");
  }
}

function getShellName(): Shell | undefined {
  if (isZsh()) {
    return "zsh";
  }

  if (process.env.NU_VERSION) {
    return "nu";
  }
}
