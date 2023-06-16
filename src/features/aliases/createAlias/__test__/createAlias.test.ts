import { expect, it } from "vitest";
import { readVaultConfigs } from "../../../../core/config/readVaultConfigs";
import { cloneTestVault } from "../../../../testing/utils/cloneTestVault";
import { execCreateAlias } from "../createAlias";

it("should create in root vault", async () => {
  const { vaultPath, removeTestVault } = await cloneTestVault("1");

  const vaults = await readVaultConfigs({
    feature: { name: "notes" },
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
