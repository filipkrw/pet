const PowerShell = require("./PowerShell");

const powerShell = new PowerShell();

function normalize(script) {
  return script.trim().replace(new RegExp("\t|  ", "g"), "");
}

test("transform alias to powerShell function", () => {
  const result = powerShell.transform(
    "com",
    "command <option> <another_option> -x <option> <rest*>"
  );
  expect(normalize(result)).toEqual(
    normalize(`function com($option, $another_option) {
    $expr = "command $($option) $($another_option) -x $($option) $($args)"
    Invoke-Expression $expr
}`)
  );
});

test("transform alias to powerShell function (multiline)", () => {
  const result = powerShell.transform(
    "com",
    "command <option> <another-option> -x <option> <rest*>\necho <rest*>"
  );
  expect(normalize(result)).toEqual(
    normalize(`function com($option, $another_option) {
      $expr = "command $($option) $($another_option) -x $($option) $($args)
      echo $($args)"
      Invoke-Expression $expr
    }`)
  );
});
