import path from "path";
import { expect, test } from "vitest";
import { getRootPath } from "../../../util/getRootPath.js";
import { readVaultConfigs } from "../readVaultConfigs.js";

const basePath = path.join(getRootPath(), ".tmp");

test("don't load vault that disabled test feature", async () => {
  const vaults = await readVaultConfigs({
    feature: { name: "test" },
    localConfig: { basePath: basePath },
  });

  expect(vaults).toEqual([
    {
      relativePath: "",
      absolutePath: "/Users/filip/Documents/Dev/pet/.tmp",
      subVaultsRelativePaths: ["another-subvault", "subvault/nested-subvault"],
      config: {},
    },
    {
      relativePath: "another-subvault",
      absolutePath: "/Users/filip/Documents/Dev/pet/.tmp/another-subvault",
      subVaultsRelativePaths: [],
      config: {},
    },
    {
      relativePath: "subvault/nested-subvault",
      absolutePath:
        "/Users/filip/Documents/Dev/pet/.tmp/subvault/nested-subvault",
      subVaultsRelativePaths: [],
      config: {
        features: {
          disable: ["notes"],
        },
      },
    },
  ]);
});
