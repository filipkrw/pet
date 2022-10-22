import clc from "cli-color";
import parseArgvOptions from "../../cmdArgs/parseArgvOptions.js";
import { getAllAliases } from "../helpers.js";
function handleList(argv) {
    const args = parseListArgv(argv);
    const aliases = getAllAliases().sort((a, b) => a.alias.localeCompare(b.alias));
    for (const alias of aliases) {
        console.log(`${clc.green.bold(alias.alias)} ${clc.green(`(${alias.relativePath})`)}`);
        if (args.verbose) {
            console.log(alias.content.trim());
            console.log();
        }
    }
    const aliasesCount = aliases.length;
    console.log(clc.blue.bold(`${aliasesCount} alias${aliasesCount === 1 ? "" : "es"} found`));
}
function parseListArgv(argv) {
    return parseArgvOptions([{ name: "verbose", alias: "v", type: Boolean }], argv);
}
export default handleList;
