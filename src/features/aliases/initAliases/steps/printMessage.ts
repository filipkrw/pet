import clc from "cli-color";

export function printMessage() {
  console.log(
    clc.bold.green("Done!"),
    `Restart your terminal to finish the installation.`
  );
}
