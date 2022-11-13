export type Vault<T> = {
  relativePath: string;
  absolutePath: string;
} & T;

export type VaultWithSubVaults<T> = Vault<T> & {
  vaults?: VaultWithSubVaults<T>[];
};
