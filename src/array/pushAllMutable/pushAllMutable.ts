/**
 * 配列の末尾に別の配列の全ての要素を追加する（破壊的変更）
 * @param data 追加先の配列
 * @param source 追加する要素を持つ配列。null・undefinedは空配列として扱う
 * @returns 要素を追加した同じ配列
 */
export default function pushAllMutable<T>(
  data: T[],
  source: readonly T[] | null | undefined,
): T[] {
  if (source) {
    // push(...source) は要素数が多いと引数の上限を超えるため1つずつ追加する
    for (const item of source) {
      data.push(item);
    }
  }
  return data;
}
