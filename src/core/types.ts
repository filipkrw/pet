import { FindArgs } from "../features/notes/findNotes/parseFindArgv";

export type Vault<T = unknown> = {
  relativePath: string;
  absolutePath: string;
  includePatterns?: string[];
  excludePatterns?: string[];
  plugins?: VaultPlugin[];
  textEditor?: string;
  features?: {
    disable?: string[];
    enable?: string[];
  };
} & T;

export type VaultWithSubVaults<T = unknown> = Vault<T> & {
  vaults?: VaultWithSubVaults<T>[];
};

export type VaultPlugin = {
  command: "find";
  flow(configs: LoadedConfigs): Promise<unknown>;
};

export type LocalConfig = {
  basePath: string;
};

export type LoadedConfigs = {
  args: FindArgs;
  localConfig: LocalConfig;
  vault: VaultWithSubVaults<unknown>;
};
