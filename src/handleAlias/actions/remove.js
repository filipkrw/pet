import shellsBulkWrite from "../shells/shellsBulkWrite.js";
import { getAllAliases } from "../helpers.js";
import getSourceRawConfigFile from "../getSourceRawConfigFile.js";
import fs from "fs";
import moduleExportsStr from "../../util/moduleExportsStr.js";
import CommandError from "../CommandError.js";
import parseArgvOptions from "../../cmdArgs/parseArgvOptions.js";
// Need to find file path by alias name
function handleRemove(argv) {
    const { alias } = parseRemoveArgv(argv);
    const allAliases = getAllAliases();
    const aliasToRemove = allAliases.find((a) => a.alias === alias);
    if (!aliasToRemove) {
        throw new CommandError(`Alias "${alias}" not found.`);
    }
    const sourceConfigRaw = getSourceRawConfigFile(aliasToRemove.source);
    const updatedAliases = sourceConfigRaw.aliases.filter((a) => a.alias !== alias);
    const { aliases, ...rest } = sourceConfigRaw;
    const updatedConfig = updatedAliases.length === 0 ? rest : { ...rest, aliases: updatedAliases };
    fs.writeFileSync(aliasToRemove.source.configAbsolutePath, moduleExportsStr(updatedConfig));
    shellsBulkWrite();
    console.log(`Alias "${alias}" removed.`);
}
function parseRemoveArgv(argv) {
    return parseArgvOptions([{ name: "alias", type: String, defaultOption: true }], argv);
}
export default handleRemove;
