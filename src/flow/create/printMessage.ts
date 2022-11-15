import clc from "cli-color";
import { fileExists } from "../../util/files.js";

export function printMessage({
  file,
}: {
  file: {
    absolutePath: string;
  };
}) {
  if (fileExists(file.absolutePath)) {
    console.log(clc.bold.green("Done!"));
  } else {
    console.log(clc.bold.yellow("Aborted"));
  }
}
