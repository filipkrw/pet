import parseArgvOptions from "./cmdArgs/parseArgvOptions.js";
import { getAllFiles, getFileAbsolutePath, getFileRootRelativePath } from "./handleAlias/helpers.js";
import path from "path";
import { fileExists } from "./util/files.js";
import fs from "fs";
import normalizePath from "./util/normalizePath.js";
function handleRemove(argv) {
    const { snippetPath } = parseRemoveArgv(argv);
    const files = getAllFiles();
    const file = files.find((file) => {
        return getFileRootRelativePath(file) === path.normalize(snippetPath);
    });
    if (!file) {
        throw new Error(`No snippet found at "${snippetPath}".`);
    }
    const fileAbsolutePath = getFileAbsolutePath(file);
    if (fileExists(fileAbsolutePath)) {
        fs.rmSync(fileAbsolutePath);
        console.log(`Snippet "${normalizePath(getFileRootRelativePath(file))}" removed.`);
    }
}
function parseRemoveArgv(argv) {
    const options = parseArgvOptions([{ name: "snippetPath", defaultOption: true }], argv);
    return options;
}
export default handleRemove;
