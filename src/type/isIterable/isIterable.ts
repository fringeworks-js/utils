/**
 * イテレーターを持つ値か判定する。文字列も true になる
 * @param value 判定する値
 * @returns `Symbol.iterator` のメソッドを持つ場合は true
 */
export default function isIterable(value: unknown): value is Iterable<unknown> {
  return (
    value != null &&
    typeof (value as Record<symbol, unknown>)[Symbol.iterator] === 'function'
  );
}
