export async function exec<T, U>(
  input: T,
  func: (x: T) => U | Promise<U>
): Promise<T & U> {
  const output = await Promise.resolve(func(input));
  return { ...input, ...output };
}
