import { z } from "zod";
import { loadCoreConfigs } from "../../../core/config/loadCoreConfigs.js";
import { exec } from "../../../core/exec.js";
import { bookmarks } from "../Bookmarks.js";
import { createBookmarkFrontmatter } from "./createBookmarkFrontmatter.js";
import { getBookmarkMetadata } from "./getBookmarkMetadata.js";
import { saveBookmarkFile } from "./saveBookmarkFile.js";

export type CreateBookmarkInput = z.infer<typeof createBookmarkInputSchema>;

export const createBookmarkInputSchema = z.object({
  vaultRelativePath: z.string().optional(),
  title: z.string(),
  url: z.string().url(),
  tags: z.array(z.string()).optional(),
  note: z.string().optional(),
});

export async function createBookmark(input: CreateBookmarkInput) {
  return Promise.resolve({ input, ...bookmarks.getMeta() })
    .then((x) => exec(x, loadCoreConfigs))
    .then((x) => exec(x, getBookmarkMetadata))
    .then((x) => exec(x, createBookmarkFrontmatter))
    .then((x) => exec(x, saveBookmarkFile));
}
