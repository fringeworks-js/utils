/**
 * 配列の末尾に別の配列の全ての要素を追加した新しい配列を返す。
 * @param data 追加先の配列。null・undefinedは空配列として扱う
 * @param source 追加する要素を持つ配列。null・undefinedは空配列として扱う
 * @returns 要素を追加した新しい配列
 */
export default function pushAll<T>(
  data: readonly T[] | null | undefined,
  source: readonly T[] | null | undefined,
): T[] {
  return [...(data ?? []), ...(source ?? [])];
}
