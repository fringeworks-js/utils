/**
 * イテレーターを持つインスタンスか判定します
 * @param value
 * @returns
 */
export default function isIterable<T>(value: unknown): value is Iterable<T> {
  return (
    value != null &&
    typeof (value as Record<symbol, unknown>)[Symbol.iterator] === 'function'
  );
}
