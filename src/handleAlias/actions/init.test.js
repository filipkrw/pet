import fs from "fs";
import path from "path";
import mockConfig from "../../util/mockConfig.js";
import handleInit from "./init.js";
import config from "../../config.js";
const { updateConfig } = config;
afterEach(() => {
    return fs.rmSync(".tmp", {
        recursive: true,
        force: true,
    });
});
const aliasesConfigPath = path.normalize(path.join(".tmp", ".pet", "aliases", "config.json"));
jest.mock("child_process", () => {
    const path = path;
    return {
        exec: (...args) => {
            const callback = args[args.length - 1];
            callback(null, {
                stdout: path.normalize(path.join(path.join(".tmp", "windows"), "Microsoft.PowerShell_profile.ps1")),
            }, null);
        },
    };
});
test("alias init (windows)", async () => {
    const base = ".tmp";
    const dotPet = path.join(base, ".pet");
    updateConfig({
        path: {
            base,
            dotPet,
            aliases: {
                base: path.join(dotPet, "aliases"),
                config: path.join(dotPet, "aliases", "config.json"),
            },
        },
        platform: "win32",
    });
    await handleInit();
    const aliasesConfig = JSON.parse(fs.readFileSync(aliasesConfigPath).toString());
    expect(aliasesConfig).toEqual({ shells: ["powershell"] });
    const powershellProfilePath = path.normalize(path.join(".tmp", "windows", "Microsoft.PowerShell_profile.ps1"));
    const powershellProfile = fs.readFileSync(powershellProfilePath).toString();
    expect(powershellProfile.trim()).toEqual(`. ${path.join(".tmp", ".pet", "aliases", "transformed", "PowerShell_aliases.ps1")}`);
});
