export type Vault<T = unknown> = {
  relativePath: string;
  absolutePath: string;
  includePatterns?: string[];
  excludePatterns?: string[];
} & T;

export type VaultWithSubVaults<T = unknown> = Vault<T> & {
  vaults?: VaultWithSubVaults<T>[];
};
