import os from "os";
import path from "path";
import petConfig from "../localConfig/petConfig.cjs";
import deepMerge from "./util/deepMerge.js";
import { fileExists, readJsonFile } from "./util/files.js";
import getRootPath from "./util/getRootPath.js";
function initConfig() {
    let config = {
        path: generatePaths(),
        localConfig: getLocalConfig(),
        platform: os.platform(),
        shell: process.env.SHELL,
        defaultExclude: [".pet", ".git"],
    };
    const userConfig = getUserConfig();
    const textEditor = userConfig.textEditor || process.env.EDITOR || "nano";
    updateConfig({
        userConfig,
        textEditor,
    });
    function updateConfig(params) {
        config = deepMerge(config, params);
    }
    function generatePaths() {
        const base = path.normalize(petConfig.basePath);
        const dotPet = path.normalize(path.join(base, ".pet"));
        return { base, dotPet };
    }
    function getUserConfig() {
        const basePath = petConfig.basePath;
        const resolvedConfig = resolveUserConfig(userConfig, config.path.base);
        return { ...resolvedConfig, absolutePath: basePath };
    }
    function resolveUserConfig(userConfig, userConfigPath) {
        if (userConfig.sources) {
            const sources = userConfig.sources.map((s) => resolveSource(s, userConfigPath));
            return { ...userConfig, sources };
        }
        return userConfig;
    }
    function resolveSource(source, sourcePath) {
        const name = source.name || path.basename(source.relativePath || source.absolutePath);
        const absolutePath = source.absolutePath || path.resolve(sourcePath, source.relativePath);
        const exclude = source.exclude || config.defaultExclude;
        const sourceConfig = { ...source, name, absolutePath, exclude };
        const subconfigPath = path.join(absolutePath, ".pet", "config.js");
        if (fileExists(subconfigPath)) {
            return { ...sourceConfig, ...resolveUserConfig(subconfig, absolutePath) };
        }
        return sourceConfig;
    }
    /**
     * Config local to the user's machine.
     */
    function getLocalConfig() {
        const localConfigAbsolutePath = path.normalize(path.join(getRootPath(), "localConfig"));
        const shellsAbsolutePath = path.join(localConfigAbsolutePath, "shells.json");
        const shells = fileExists(shellsAbsolutePath)
            ? readJsonFile(shellsAbsolutePath)
            : [];
        return {
            absolutePath: localConfigAbsolutePath,
            shells: {
                absolutePath: shellsAbsolutePath,
                shells,
            },
            transformedAliases: {
                absolutePath: path.join(localConfigAbsolutePath, "transformedAliases"),
            },
        };
    }
    function getFileSource(filePath) {
        // TODO perhaps handle nested sources
        return config.userConfig.sources.find((source) => {
            return filePath.startsWith(source.name);
        });
    }
    function getFileDetails(filePath) {
        const source = getFileSource(filePath);
        const filePathNoSource = filePath.replace(new RegExp(`^${source.name}/`), "");
        return {
            source,
            relativePath: filePathNoSource,
            absolutePath: path.join(source.absolutePath, filePathNoSource),
        };
    }
    return {
        config,
        updateConfig,
        getFileDetails,
    };
}
export default initConfig();
