import fs from "fs/promises";

export async function writeFromTemplate(
  templatePath: string,
  targetPath: string,
  variables: Record<string, string> = {}
) {
  const template = await fs.readFile(templatePath, "utf8");
  const replacer = getReplacer(variables);
  const result = template.replace(/\{\{([^}]+)\}\}/g, replacer);
  return fs.writeFile(targetPath, result, { flag: "w" });
}

function getReplacer(variables: Record<string, string>) {
  return function (_: string, key: string) {
    return variables[key] || key;
  };
}
