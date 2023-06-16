import { expect, it } from "vitest";
import { readVaultConfigs } from "../../../../core/config/readVaultConfigs";
import { cloneTestVault } from "../../../../testing/utils/cloneTestVault";
import { execCreateAlias } from "../createAlias";
import path from "path";

it("creates inline alias in root vault", async () => {
  const { vaultPath, removeTestVault } = await cloneTestVault("1");

  const vaults = await readVaultConfigs({
    feature: { name: "aliases" },
    localConfig: { basePath: vaultPath },
  });

  const { updatedVault } = await execCreateAlias({
    ...vaults,
    feature: { name: "aliases" },
    localConfig: { basePath: vaultPath },
    newAlias: {
      alias: "test",
      source: {
        type: "inline",
        content: "echo hello",
      },
    },
  });

  expect(updatedVault.absolutePath).toEqual(vaultPath);
  expect(updatedVault.aliases).toEqual([
    { alias: "test", source: { type: "inline", content: "echo hello" } },
  ]);

  await removeTestVault();
});

it("creates note alias in subvault", async () => {
  const { vaultPath, removeTestVault } = await cloneTestVault("1");

  const vaults = await readVaultConfigs({
    feature: { name: "aliases" },
    localConfig: { basePath: vaultPath },
  });

  const { updatedVault } = await execCreateAlias({
    ...vaults,
    feature: { name: "aliases" },
    localConfig: { basePath: vaultPath },
    newAlias: {
      alias: "test",
      source: {
        type: "note",
        relativePath: "subvault/hello-world",
      },
    },
  });

  expect(updatedVault.absolutePath).toEqual(path.join(vaultPath, "subvault"));
  expect(updatedVault.aliases).toEqual([
    { alias: "test", source: { type: "note", relativePath: "hello-world" } },
  ]);

  await removeTestVault();
});
