import fs from "fs/promises";
import path from "path";
import { afterEach, beforeEach, expect, test } from "vitest";
import {
  writeLocalConfig,
  writeVaultConfig,
} from "../../../features/config/setConfig.js";
import { getRootPath } from "../../../util/getRootPath";
import { exec } from "../../exec";
import { readVaultConfig } from "../readVaultConfig.js";

const testBasePath = path.join(getRootPath(), ".tmp");

beforeEach(async () => {
  await Promise.resolve({
    localConfig: { basePath: testBasePath },
  })
    .then((x) => exec(x, writeLocalConfig))
    .then((x) => exec(x, writeVaultConfig));
});

afterEach(async () => {
  await fs.rm(testBasePath, { recursive: true });
});

test("readVaultConfig", async () => {
  const vaults = await readVaultConfig({
    feature: {
      name: "notes",
    },
    localConfig: {
      basePath: testBasePath,
    },
  });
  console.log(vaults);
});
