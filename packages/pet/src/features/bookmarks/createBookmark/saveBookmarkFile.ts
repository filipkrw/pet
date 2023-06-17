import { createFileIfNotExists } from "../../../utils/files.js";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata.js";
import fs from "fs/promises";
import { CreateBookmarkInput } from "./createBookmark";

export async function saveBookmarkFile({
  input,
  frontmatter,
  note,
}: {
  input: CreateBookmarkInput;
  frontmatter: string;
  note: NoteMetadata;
}) {
  createFileIfNotExists(note.absolutePath);
  const noteContent = `${frontmatter}${input.note?.trim() || ""}`;
  await fs.writeFile(note.absolutePath, noteContent.trim());
}
