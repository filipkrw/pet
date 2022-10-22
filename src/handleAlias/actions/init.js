import config$0 from "../../config.js";
import PowerShell from "../shells/PowerShell/index.js";
import Bash from "../shells/Bash/index.js";
import Zsh from "../shells/Zsh/Zsh.js";
import CommandError from "../CommandError.js";
const { config } = config$0;
async function handleInit() {
    if (config.platform === "win32") {
        const powerShell = new PowerShell();
        await powerShell.init();
    }
    else if (["linux", "darwin"].includes(config.platform)) {
        if (config.shell.indexOf("bash") > -1) {
            const bash = new Bash();
            bash.init();
        }
        else if (config.shell.indexOf("zsh") > -1) {
            const zsh = new Zsh();
            zsh.init();
        }
        else {
            throw new CommandError(`Shell "${config.shell}" not supported.`);
        }
    }
    else {
        throw new CommandError(`Platform "${config.platform}" not supported.`);
    }
}
export default handleInit;
