import path from "path";
import { expect, it } from "vitest";
import { getTestVaultPath } from "../../../testing/utils/getTestVaultPath.js";
import { readVaultConfigs } from "../readVaultConfigs.js";

const basePath = getTestVaultPath("1");

it("doesn't include the vault that disabled test feature", async () => {
  const vaults = await readVaultConfigs({
    feature: { name: "test" },
    localConfig: { basePath: basePath },
  });

  expect(vaults).toEqual([
    {
      relativePath: "",
      absolutePath: path.join(basePath),
      subVaultsRelativePaths: ["another-subvault", "subvault/nested-subvault"],
      config: {},
    },
    {
      relativePath: "another-subvault",
      absolutePath: path.join(basePath, "another-subvault"),
      subVaultsRelativePaths: [],
      config: {},
    },
    {
      relativePath: "subvault/nested-subvault",
      absolutePath: path.join(basePath, "subvault/nested-subvault"),
      subVaultsRelativePaths: [],
      config: {
        features: {
          disable: ["notes"],
        },
      },
    },
  ]);
});
