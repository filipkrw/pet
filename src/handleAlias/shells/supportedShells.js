import Bash from "./Bash/index.js";
import PowerShell from "./PowerShell/index.js";
import Zsh from "./Zsh/Zsh.js";
export { PowerShell as powershell };
export { Bash as bash };
export { Zsh as zsh };
export default {
    powershell: PowerShell,
    bash: Bash,
    zsh: Zsh
};
