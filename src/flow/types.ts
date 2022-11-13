export type ArgvOptions = {
  argv: string[];
};

export type VaultPathsMinimal = {
  relativePath: string;
  absolutePath?: string;
};

export type VaultPaths = {
  relativePath: string;
  absolutePath: string;
};

export type BaseConfig = VaultPaths & {
  vaults?: VaultPathsMinimal[];
};

export type FullConfig = VaultPaths & {
  vaults?: FullConfig[];
};
