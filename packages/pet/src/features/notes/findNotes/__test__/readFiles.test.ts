import { expect, it } from "vitest";
import { getTestVaultPath } from "../../../../testing/utils/getTestVaultPath";
import { readFiles } from "../readFiles";
import { readVaultConfigs } from "../../../../core/config/readVaultConfigs";

it("correctly reads files", async () => {
  const vaultPath = getTestVaultPath("1");

  const { vaults } = await readVaultConfigs({
    feature: { name: "notes" },
    localConfig: { basePath: vaultPath },
  });

  const { vaults: vaultsWithFiles } = await readFiles({
    vaults,
  });

  expect(vaultsWithFiles.length).toBe(2);

  expect(vaultsWithFiles[0].files).toEqual([
    {
      name: "note1",
      relativePath: "note1",
      absolutePath: `${vaultPath}/note1`,
      vault: {
        absolutePath: vaultPath,
        relativePath: "",
      },
      content: "Hello World",
    },
  ]);

  expect(vaultsWithFiles[1].files).toEqual([
    {
      name: "note4",
      relativePath: "note4",
      absolutePath: `${vaultPath}/another-subvault/note4`,
      vault: {
        absolutePath: `${vaultPath}/another-subvault`,
        relativePath: "another-subvault",
      },
      content: "Hello World",
    },
  ]);
});
