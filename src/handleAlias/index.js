import handleInit from "./actions/init.js";
import handleRemove from "./actions/remove.js";
import handleAdd from "./actions/add.js";
import handleList from "./actions/list.js";
import sourceConfig from "../sourceConfig.js";
import aliasesResolver from "../resolvers/aliasesResolver.js";
import handleArgvCommands from "../cmdArgs/handleArgvCommands.js";
async function handleAlias(argv, subcommand) {
    sourceConfig.resolve(aliasesResolver);
    handleArgvCommands([
        { commands: ["init", "i"], callback: handleInit },
        { commands: ["add", "a"], callback: handleAdd },
        { commands: ["remove", "r"], callback: handleRemove },
        { commands: ["list", "l"], callback: handleList },
    ], subcommand ? [subcommand, ...argv] : argv);
}
export default handleAlias;
