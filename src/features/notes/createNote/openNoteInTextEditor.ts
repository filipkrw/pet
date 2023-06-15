import path from "path";
import { createDirectoryIfNotExists } from "../../../utils/files.js";
import { NoteMetadata } from "./getNoteMetadata.js";
import { openEditor } from "./openEditor.js";

export async function openNoteInTextEditor({ note }: { note: NoteMetadata }) {
  createDirectoryIfNotExists(path.dirname(note.absolutePath));
  await openEditor({
    file: { absolutePath: note.absolutePath },
    vault: note.parentVault,
  });
}
