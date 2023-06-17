import { createFrontmatter } from "../../dailyNotes/createDailyNote/createFileWithFronmatter.js";
import { CreateBookmarkInput } from "./createBookmark.js";

export function createBookmarkFrontmatter({
  input,
}: {
  input: CreateBookmarkInput;
}) {
  const frontmatter = createFrontmatter({
    title: input.title,
    url: input.url,
    datetime: new Date().toISOString(),
    tags: input.tags,
  });
  return { frontmatter };
}
