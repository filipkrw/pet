import { FindArgs } from "../flow/find/parseFindArgv";
import { LocalConfig } from "../flow/types";

export type Vault<T = unknown> = {
  relativePath: string;
  absolutePath: string;
  includePatterns?: string[];
  excludePatterns?: string[];
  plugins?: VaultPlugin[];
} & T;

export type VaultWithSubVaults<T = unknown> = Vault<T> & {
  vaults?: VaultWithSubVaults<T>[];
};

export type LoadedConfigs = {
  args: FindArgs;
  localConfig: LocalConfig;
  vault: VaultWithSubVaults<unknown>;
};

export type VaultPlugin = {
  command: "find";
  flow(configs: LoadedConfigs): Promise<unknown>;
};
