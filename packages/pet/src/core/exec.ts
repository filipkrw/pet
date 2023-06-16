export async function exec<T extends V, U, V>(
  input: T,
  func: (x: V) => U | Promise<U>
): Promise<T & U> {
  const output = await Promise.resolve(func(input));
  return { ...input, ...output };
}
