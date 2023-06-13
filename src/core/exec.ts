import { resolve } from "./vault/resolve.js";
import { type Vault, type VaultWithSubVaults } from "./types.js";

export async function exec<T extends V, U, V>(
  input: T,
  func: (x: V) => U | Promise<U>
): Promise<T & U> {
  const output = await Promise.resolve(func(input));
  return { ...input, ...output };
}

export async function execResolve<T, U, W>(
  input: {
    vault: VaultWithSubVaults<T>;
  } & W,
  func: (x: Vault<T>) => Promise<Vault<U>>
) {
  const result = await resolve(input.vault, func);
  return { ...input, vault: result };
}
