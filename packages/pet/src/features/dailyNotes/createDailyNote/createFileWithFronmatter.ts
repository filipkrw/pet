import fs from "fs";
import yaml from "yaml";
import { createFileIfNotExists } from "../../../utils/files.js";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata.js";
import { type DailyCreateArgs } from "./parseCreateDailyNoteArgv.js";

export function createDailyFile({
  args,
  note,
}: {
  args: DailyCreateArgs;
  note: NoteMetadata & { datetime: string };
}) {
  createFileWithFronmatter(note.absolutePath, {
    datetime: note.datetime,
    tags: args.tags,
  });

  return {
    file: { absolutePath: note.absolutePath },
  };
}

async function createFileWithFronmatter(
  filePath: string,
  frontmatterObject: Record<string, unknown>
) {
  const frontmatter = createFrontmatter(frontmatterObject);
  createFileIfNotExists(filePath);
  fs.writeFileSync(filePath, frontmatter);
}

export function createFrontmatter(input: Record<string | number, unknown>) {
  const content = yaml.stringify(input);
  return `---\n${content}---\n\n`;
}
