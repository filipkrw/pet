import { scrape } from "node-save-page-we";
import { NoteMetadata } from "../../notes/createNote/getNoteMetadata.js";
import { CreateBookmarkInput } from "./createBookmark.js";
import fs from "fs/promises";

export async function scrapeBookmarkedPage({
  input,
  note,
}: {
  input: CreateBookmarkInput;
  note: NoteMetadata & {
    pageHtmlAbsolutePath: string;
  };
}) {
  try {
    const pageHtml = await scrape({ url: input.url });
    await fs.writeFile(note.pageHtmlAbsolutePath, pageHtml);
  } catch (e) {
    console.log(e);
    console.log(`Failed to scrape page: ${input.url}`);
  }
}
