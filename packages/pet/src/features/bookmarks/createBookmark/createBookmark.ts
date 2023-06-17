import { z } from "zod";
import { bookmarks } from "../Bookmarks.js";

export type CreateBookmark = z.infer<typeof createBookmarkSchema>;

export const createBookmarkSchema = z.object({
  url: z.string().url(),
});

export async function createBookmark(input: CreateBookmark) {
  return Promise.resolve({ input, ...bookmarks.getMeta() }).then((x) =>
    console.log(x)
  );
}
