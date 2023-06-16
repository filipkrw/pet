import { expect, it } from "vitest";
import { Vault } from "../../types";
import { findParentVault } from "../findParentVault";

const vaults = [
  { absolutePath: "/vault" },
  { absolutePath: "/vault/snippets" },
  { absolutePath: "/vault/notes" },
  { absolutePath: "/vault/notes/daily" },
] as Vault[];

it("finds correct parent vault", () => {
  const parentVault1 = findParentVault("/vault/notes/daily/1.md", vaults);
  expect(parentVault1?.absolutePath).toBe("/vault/notes/daily");

  const parentVault2 = findParentVault("/vault/2.md", vaults);
  expect(parentVault2?.absolutePath).toBe("/vault");

  const parentVault3 = findParentVault("/xd", vaults);
  expect(parentVault3).toBe(undefined);
});
