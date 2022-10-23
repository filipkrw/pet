import config from "../../config.js";
import PowerShell from "../shells/PowerShell/index.js";
import Bash from "../shells/Bash/index.js";
import Zsh from "../shells/Zsh/Zsh.js";
import CommandError from "../CommandError.js";

const { config: globalConfig } = config;

async function handleInit() {
  if (globalConfig.platform === "win32") {
    const powerShell = new PowerShell();
    await powerShell.init();
  } else if (["linux", "darwin"].includes(globalConfig.platform)) {
    if (globalConfig.shell.indexOf("bash") > -1) {
      const bash = new Bash();
      bash.init();
    } else if (globalConfig.shell.indexOf("zsh") > -1) {
      const zsh = new Zsh();
      zsh.init();
    } else {
      throw new CommandError(`Shell "${globalConfig.shell}" not supported.`);
    }
  } else {
    throw new CommandError(
      `Platform "${globalConfig.platform}" not supported.`
    );
  }
}
export default handleInit;
