import { expect, test, beforeAll } from "vitest";
import { readVaultConfig } from "../readVaultConfig.js";

beforeAll(() => {
  console.log("beforeAll");
});

test("toUpperCase", () => {
  expect("xd").toBe("xd");
});
