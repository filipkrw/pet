const { aliasToPowershell } = require("./powershell");

const tabsSpacesRegex = new RegExp("\t|  ", "g");

test("transform alias to powershell function", () => {
  const result = aliasToPowershell(
    "com",
    "command <option> <another_option> -x <option> <rest*>"
  );
  expect(result).toEqual(`function com($option, $another_option) {
			$expr = "command $($option) $($another_option) -x $($option) $($args)"
      Invoke-Expression $expr
	}`);
});

test("transform alias to powershell function (multiline)", () => {
  const result = aliasToPowershell(
    "com",
    "command <option> <another-option> -x <option> <rest*>\necho <rest*>"
  );
  const shouldBe = `function com($option, $another_option) {
    $expr = "command $($option) $($another_option) -x $($option) $($args)
    echo $($args)"
    Invoke-Expression $expr
  }`;
  expect(result.replace(tabsSpacesRegex, "")).toEqual(
    shouldBe.replace(tabsSpacesRegex, "")
  );
});
