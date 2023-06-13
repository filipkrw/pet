import fs from "fs/promises";
import path from "path";
import { afterEach, beforeEach, test } from "vitest";
import {
  writeLocalConfig,
  writeVaultConfig,
} from "../../../features/config/setConfig.js";
import { getRootPath } from "../../../util/getRootPath";
import { exec } from "../../exec";
import { readVaultConfig } from "../readVaultConfig.js";

const basePath = path.join(getRootPath(), ".tmp");
const subVaultPaths = [
  path.join(basePath, "subvault"),
  path.join(basePath, "subvault", "super-nested-subvault"),
  path.join(basePath, "another-subvault"),
];

beforeEach(async () => {
  await Promise.resolve({ localConfig: { basePath } })
    .then((x) => exec(x, writeVaultConfig))
    .then(() =>
      exec({ localConfig: { basePath: subVaultPaths[0] } }, writeVaultConfig)
    )
    .then(() =>
      exec({ localConfig: { basePath: subVaultPaths[1] } }, writeVaultConfig)
    )
    .then(() =>
      exec({ localConfig: { basePath: subVaultPaths[2] } }, writeVaultConfig)
    );
});

afterEach(async () => {
  await fs.rm(basePath, { recursive: true });
});

test("readVaultConfig", async () => {
  const vaults = await readVaultConfig({
    feature: {
      name: "notes",
    },
    localConfig: {
      basePath: basePath,
    },
  });
  console.log(vaults);
});
