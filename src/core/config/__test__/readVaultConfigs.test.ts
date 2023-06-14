import path from "path";
import { expect, it } from "vitest";
import { getTestVaultPath } from "../../../testing/utils/getTestVaultPath.js";
import { readVaultConfigs } from "../readVaultConfigs.js";

it("correctly reads vaults", async () => {
  const vaultPath = getTestVaultPath("1");

  const { vaults } = await readVaultConfigs({
    feature: { name: "aliases" },
    localConfig: { basePath: vaultPath },
  });

  expect(vaults).toEqual([
    {
      relativePath: "",
      absolutePath: vaultPath,
      subVaultsRelativePaths: [
        "another-subvault",
        "subvault",
        "subvault/nested-subvault",
      ],
      config: {},
    },
    {
      relativePath: "another-subvault",
      absolutePath: path.join(vaultPath, "another-subvault"),
      subVaultsRelativePaths: [],
      config: {},
    },
    {
      relativePath: "subvault",
      absolutePath: path.join(vaultPath, "subvault"),
      subVaultsRelativePaths: ["nested-subvault"],
      config: {
        features: {
          disable: ["notes"],
        },
      },
    },
    {
      relativePath: "subvault/nested-subvault",
      absolutePath: path.join(vaultPath, "subvault/nested-subvault"),
      subVaultsRelativePaths: [],
      config: {},
    },
  ]);
});

it("doesn't include the vault that disabled test feature", async () => {
  const vaultPath = getTestVaultPath("1");

  const { vaults } = await readVaultConfigs({
    feature: { name: "notes" },
    localConfig: { basePath: vaultPath },
  });

  expect(vaults).toEqual([
    {
      relativePath: "",
      absolutePath: vaultPath,
      subVaultsRelativePaths: ["another-subvault"],
      config: {},
    },
    {
      relativePath: "another-subvault",
      absolutePath: path.join(vaultPath, "another-subvault"),
      subVaultsRelativePaths: [],
      config: {},
    },
  ]);
});
