import config$0 from "../config.js";
import path from "path";
import fs from "fs";
import sourceConfig from "../sourceConfig.js";
const { config } = config$0;
function resolveAliases(userConfig = config.userConfig, resolvedAliases = []) {
    const aliases = (userConfig.aliases || []).map((a) => resolveAlias(a, userConfig));
    const moreAliases = (userConfig.sources || []).reduce((acc, s) => {
        return resolveAliases(s, acc);
    }, aliases);
    return [...resolvedAliases, ...moreAliases];
}
function resolveAlias(alias, sourceConfig) {
    const aliasPath = path.join(sourceConfig.absolutePath, alias.relativePath);
    const aliasContent = fs.readFileSync(aliasPath, { encoding: "utf-8" });
    return {
        ...alias,
        absolutePath: aliasPath,
        content: aliasContent,
        // source: sourceConfig,
    };
}
export default resolveAliases;
