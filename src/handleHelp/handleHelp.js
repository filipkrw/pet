import { promises as fs } from "fs";
import url from "url";
import path from "path";

async function handleHelp() {
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  const help = await fs.readFile(path.join(__dirname, "help.txt"), "utf8");
  console.log(help);
}

export default handleHelp;
