import path from "path";
import fs from "fs";
import config$0 from "../../config.js";
import { createFileIfNotExists } from "../../util/files.js";
import removeDuplicates from "../../util/removeDuplicates.js";
import { getAllAliases } from "../helpers.js";
const { config, updateConfig } = config$0;
class Shell {
    constructor(name, file) {
        this.name = name;
        this.file = file;
        updateConfig({
            path: {
                aliases: {
                    [name]: path.join(config.localConfig.transformedAliases.absolutePath, file),
                },
            },
        });
    }
    async init() {
        await this.mount();
        this.write();
        this.writeShellConfig();
    }
    write() {
        const aliases = getAllAliases();
        const transformed = [];
        for (const { alias, content, source } of aliases) {
            try {
                transformed.push(this.transform(alias, content));
            }
            catch (e) {
                console.log(`Error reading "${source.name}", skipping...`);
                continue;
            }
        }
        const transformedPath = path.join(config.localConfig.transformedAliases.absolutePath, this.file);
        createFileIfNotExists(transformedPath);
        fs.writeFileSync(transformedPath, transformed.join("\n\n"));
    }
    writeShellConfig() {
        const shellConfigPath = config.localConfig.shells.absolutePath;
        createFileIfNotExists(shellConfigPath);
        const shellConfigJSON = fs.readFileSync(shellConfigPath, {
            encoding: "utf-8",
        });
        const shellConfig = JSON.parse(shellConfigJSON || "[]");
        const newShells = [...shellConfig, this.name].filter(removeDuplicates);
        fs.writeFileSync(shellConfigPath, JSON.stringify(newShells, null, 2));
    }
}
export default Shell;
