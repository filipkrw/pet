import clc from "cli-color";
import { UserShellData } from "./getUserShellData";

export function printMessage({ shell }: { shell: UserShellData }) {
  console.log(
    clc.bold.green("Done!"),
    `Restart your terminal to finish the installation.`
  );
}
