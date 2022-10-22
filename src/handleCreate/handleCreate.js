import clc from "cli-color";
import promptUser from "../util/promptUser.js";
import config$0 from "../config.js";
import path from "path";
import { fileExists, createDirectoryIfNotExists } from "../util/files.js";
import { spawn as spawn$0 } from "child_process";
const { config } = config$0;
const spawn = { spawn: spawn$0 }.spawn;
async function handleCreate() {
    const relativePath = await promptForFilePath();
    const absolutePath = path.resolve(config.path.dotPet, "..", relativePath);
    createDirectoryIfNotExists(path.dirname(absolutePath));
    await openEditor(absolutePath);
    if (fileExists(absolutePath)) {
        console.log(clc.bold.green("Done!"));
    }
    else {
        console.log(clc.bold.yellow("Aborted"));
    }
}
async function promptForFilePath() {
    const filePath = await promptUser(clc.white("Path: "));
    return filePath;
}
async function openEditor(filePath) {
    // TODO make editor customizable; there should be a machine-specific config; up to the user where to place settings
    // const editor = process.env.EDITOR || "nano";
    const process = spawn(config.textEditor, [filePath], {
        shell: true,
        stdio: "inherit",
    });
    return new Promise((resolve, reject) => {
        process.on("close", () => resolve());
        process.on("exit", () => resolve());
        process.on("error", () => reject());
    });
}
export default handleCreate;
