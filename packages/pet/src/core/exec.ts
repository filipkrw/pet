import { Prettify } from "../utils/util-types";

export async function exec<T extends V, U, V>(
  input: T,
  func: (x: V) => U | Promise<U>
): Promise<Prettify<T & U>> {
  const output = await Promise.resolve(func(input));
  return { ...input, ...output };
}
