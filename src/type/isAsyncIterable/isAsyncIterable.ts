/**
 * 非同期のイテレーターを持つ値か判定する
 * @param value 判定する値
 * @returns `Symbol.asyncIterator` のメソッドを持つ場合は true
 */
export default function isAsyncIterable(
  value: unknown,
): value is AsyncIterable<unknown> {
  return (
    value != null &&
    typeof (value as Record<symbol, unknown>)[Symbol.asyncIterator] ===
      'function'
  );
}
