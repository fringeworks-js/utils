/**
 * 配列の最後の要素を返す\
 * `Array.prototype.at(-1)` は ES2022 のため、その代わりに使う
 * @param data 配列。null・undefinedの場合はundefinedを返す
 * @returns 最後の要素。空配列の場合はundefined
 */
export default function lastItem<V>(
  data: readonly V[] | null | undefined,
): V | undefined {
  return data?.[data.length - 1];
}
