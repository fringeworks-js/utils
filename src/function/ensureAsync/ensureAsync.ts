/**
 * 非同期で実行することを保証する\
 * @param fn
 * @param args
 */
export default async function ensureAsync<A extends unknown[], R>(
  fn: (...args: A) => R,
  args?: A,
): Promise<R> {
  return fn?.(...(args ?? ([] as unknown as A)));
}
