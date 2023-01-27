import fs from "fs";
import path from "path";
import yaml from "yaml";
import { createFileIfNotExists } from "../../util/files.js";
import { VaultWithSubVaults } from "../../vault/types";
import { findVaultByName } from "../findVault.js";
import { DailyCreateArgs } from "./parseDailyCreateArgv.js";

export function createDailyFile({
  args,
  vault,
}: {
  args: DailyCreateArgs;
  vault: VaultWithSubVaults;
}) {
  const now = new Date();
  const targetVault = findVaultByName(args.vault, vault);
  const relativePath = createDateTimeRelativePath(now);
  const absolutePath = path.join(targetVault.absolutePath, relativePath);

  if (args.tags) {
    createFileWithFronmatter(absolutePath, {
      tags: args.tags,
      datetime: now.toISOString(),
    });
  }

  return { file: { absolutePath } };
}

async function createFileWithFronmatter(
  filePath: string,
  frontmatterObject: Record<string | number, unknown>
) {
  const frontmatter = createFrontmatter(frontmatterObject);
  createFileIfNotExists(filePath);
  fs.writeFileSync(filePath, frontmatter);
}

function createFrontmatter(input: Record<string | number, unknown>) {
  const content = yaml.stringify(input);
  return `---\n${content}---\n\n\n`;
}

function createDateTimeRelativePath(date: Date) {
  const dateISOString = date.toISOString();

  const dateElements = dateISOString.split("T");
  const dirPath = dateElements[0].replace(/-/g, "/");
  const fileName = dateElements[1].split(".")[0];

  return path.join(dirPath, fileName);
}
