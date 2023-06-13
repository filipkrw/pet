import path from "path";
import { expect, it } from "vitest";
import { cloneTestVault } from "../../../testing/utils/cloneTestVault.js";
import { readVaultConfigs } from "../readVaultConfigs.js";

it("doesn't include the vault that disabled test feature", async () => {
  const { vaultPath, removeVault } = cloneTestVault("1");

  const vaults = await readVaultConfigs({
    feature: { name: "test" },
    localConfig: { basePath: vaultPath },
  });

  expect(vaults).toEqual([
    {
      relativePath: "",
      absolutePath: path.join(vaultPath),
      subVaultsRelativePaths: ["another-subvault", "subvault/nested-subvault"],
      config: {},
    },
    {
      relativePath: "another-subvault",
      absolutePath: path.join(vaultPath, "another-subvault"),
      subVaultsRelativePaths: [],
      config: {},
    },
    {
      relativePath: "subvault/nested-subvault",
      absolutePath: path.join(vaultPath, "subvault/nested-subvault"),
      subVaultsRelativePaths: [],
      config: {
        features: {
          disable: ["notes"],
        },
      },
    },
  ]);

  removeVault();
});
