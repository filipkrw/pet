import path from "node:path";
import { fileURLToPath } from "url";

/**
 * Returns the path to the root of the project.
 *
 * Correctness of this function is dependent on the "main"
 * path in package.json.
 */
function getRootPath() {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  return path.normalize(path.join(__dirname, "../.."));
}

export default getRootPath;
