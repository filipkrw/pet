import { createFileIfNotExists } from "../../../utils/files.js";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata.js";
import fs from "fs/promises";
import { CreateBookmarkInput } from "./createBookmark";
import { createFrontmatter } from "../../dailyNotes/createDailyNote/createFileWithFronmatter.js";

export async function saveBookmarkFile({
  input,
  note,
}: {
  input: CreateBookmarkInput;
  note: NoteMetadata;
}) {
  createFileIfNotExists(note.absolutePath);

  const frontmatter = createFrontmatter({
    title: input.title,
    url: input.url,
    datetime: new Date().toISOString(),
    tags: input.tags,
  });
  const noteContent = `${frontmatter}${input.note?.trim() || ""}`;

  await fs.writeFile(note.absolutePath, noteContent.trim());
}
