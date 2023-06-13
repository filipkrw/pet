import fs from "fs/promises";
import path from "path";
import { afterEach, beforeEach, expect, test } from "vitest";
import {
  writeLocalConfig,
  writeVaultConfig,
} from "../../../features/config/setConfig.js";
import { getRootPath } from "../../../util/getRootPath";
import { exec } from "../../exec";

const testBasePath = path.join(getRootPath(), "test-vault");

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

test("toUpperCase", () => {
  expect("xd").toBe("xd");
});
