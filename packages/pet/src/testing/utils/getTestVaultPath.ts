import path from "path";
import url from "url";

export function getTestVaultPath(name: string) {
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  return path.join(__dirname, "../test-vaults", name);
}
