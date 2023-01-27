import { readFile, unlink } from "fs/promises";

export async function deleteFileIfEmpty({
  file,
}: {
  file: { absolutePath: string };
}) {
  const contentWithFrontmatter = await readFile(file.absolutePath, "utf8");
  const content = removeFrontmatter(contentWithFrontmatter);
  if (content.trim() === "") {
    await unlink(file.absolutePath);
  }
}

function removeFrontmatter(text: string) {
  const frontmatterRegex = /---\n[\s\S]*\n---\n/;
  return text.replace(frontmatterRegex, "");
}
