import Bash from "./Bash.js";
const bash = new Bash();
function normalize(script) {
    return script.trim().replace(new RegExp("\t|  ", "g"), "");
}
test("transform alias to powerShell function", () => {
    const result = bash.transform("com", "command <option> <another_option> -x <option> <rest*>");
    expect(normalize(result)).toEqual(normalize(`
			com() {
				command $1 $2 -x $1 \${@:3}
			}
		`));
});
test("transform alias to powerShell function (multiline)", () => {
    const result = bash.transform("com", "command <option> <another-option> -x <option> <rest*>\necho <rest*>");
    expect(normalize(result)).toEqual(normalize(`
			com() {
				command $1 $2 -x $1 \${@:3}
				echo \${@:3}
			}
		`));
});
