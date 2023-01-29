import { Alias } from "./aliases/schemas/aliasSchema";
import { FindArgs } from "./core/find/parseFindArgv";

export type Vault<T = unknown> = {
  relativePath: string;
  absolutePath: string;
  includePatterns?: string[];
  excludePatterns?: string[];
  plugins?: VaultPlugin[];
  textEditor?: string;
  aliases?: Alias[];
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

export type ArgvOptions = {
  argv: string[];
  subcommand?: string;
};

export type LocalConfig = {
  basePath: string;
};
