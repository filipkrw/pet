import fs from "fs";
import path from "path";
import yaml from "yaml";
import { createFileIfNotExists } from "../../util/files.js";
import { VaultWithSubVaults } from "../types";
import { DailyCreateArgs } from "./parseDailyCreateArgv.js";

export function createDailyFile({
  args,
  vault,
}: {
  args: DailyCreateArgs;
  vault: VaultWithSubVaults;
}) {
  const now = new Date();
  const relativePath = getDailyNoteRelativePath(now);
  const absolutePath = path.join(
    vault.absolutePath,
    args.dirRelativePath || "",
    relativePath
  );

  createFileWithFronmatter(absolutePath, {
    datetime: now.toISOString(),
    tags: args.tags,
  });

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

function getDailyNoteRelativePath(date: Date) {
  const dateISOString = date.toISOString();

  const dateElements = dateISOString.split("T");
  const dirPath = dateElements[0].replace(/-/g, "/");
  const fileName = dateElements[1].split(".")[0];

  return path.join(dirPath, fileName + ".md");
}
