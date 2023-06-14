import { z } from "zod";
import { vaultSchema } from "./config/readVaultConfigs";

export type Vault<T = unknown> = z.infer<typeof vaultSchema> & T;

export type VaultWithSubVaults<T = unknown> = Vault<T>;

export type LocalConfig = {
  basePath: string;
};
