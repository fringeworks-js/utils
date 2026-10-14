/**
 * キーが配列の既存の要素を指す場合はインデックスを返す。指さない場合（`length` など）は undefined
 */
export default function _toArrayIndex(
  array: readonly unknown[],
  key: PropertyKey,
): number | undefined {
  let index: number;
  if (typeof key === 'number') {
    index = key;
  } else if (typeof key === 'string' && String(Number(key)) === key) {
    index = Number(key);
  } else {
    return undefined;
  }
  return Number.isInteger(index) && index >= 0 && index < array.length
    ? index
    : undefined;
}
