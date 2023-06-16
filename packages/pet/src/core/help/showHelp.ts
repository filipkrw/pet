import fs from "fs/promises";
import url from "url";
import path from "path";

export async function showHelp() {
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const help = await fs.readFile(path.join(__dirname, "help.txt"), "utf8");
  console.log(help);
}
