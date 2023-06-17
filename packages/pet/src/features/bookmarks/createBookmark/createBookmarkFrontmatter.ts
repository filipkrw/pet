import { createFrontmatter } from "../../dailyNotes/createDailyNote/createFileWithFronmatter.js";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata.js";
import { CreateBookmarkInput } from "./createBookmark.js";

export function createBookmarkFrontmatter({
  input,
  note,
}: {
  input: CreateBookmarkInput;
  note: NoteMetadata & { datetime: string };
}) {
  const frontmatter = createFrontmatter({
    url: input.url,
    datetime: note.datetime,
    tags: input.tags,
  });
  return { frontmatter };
}
