import clc from "cli-color";
import { fileExists } from "../../../utils/files.js";
import { NoteMetadata } from "./getNoteMetadata.js";

export function printMessage({ note }: { note: NoteMetadata }) {
  if (fileExists(note.absolutePath)) {
    console.log(clc.bold.green("Done!"));
  } else {
    console.log(clc.bold.yellow("Aborted"));
  }
}
