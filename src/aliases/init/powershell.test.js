const { aliasToPowershell } = require("./powershell");

test("transform alias to powershell function", () => {
  const result = aliasToPowershell(
    "com",
    "command <option> <another_option> -x <option> <rest*>"
  );
  expect(result).toEqual(`function com($option, $another_option) {
			command $option $another_option -x $option $args
	}`);
});

test("transform alias to powershell function (multiline)", () => {
  const result = aliasToPowershell(
    "com",
    "command <option> <another-option> -x <option> <rest*>\necho <rest*>"
  );
  expect(result).toBe(`function com($option, $another_option) {
			command $option $another_option -x $option $args
echo $args
	}`);
});
