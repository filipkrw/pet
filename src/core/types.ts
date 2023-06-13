export type Vault<T = unknown> = {
  relativePath: string;
  absolutePath: string;
  includePatterns?: string[];
  excludePatterns?: string[];
  textEditor?: string;
  features?: {
    disable?: string[];
    enable?: string[];
  };
} & T;

export type VaultWithSubVaults<T = unknown> = Vault<T> & {
  vaults?: VaultWithSubVaults<T>[];
};

export type LocalConfig = {
  basePath: string;
};
